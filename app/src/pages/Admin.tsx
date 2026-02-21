import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Search,
  Eye,
  TrendingUp,
  DollarSign,
  Box,
  AlertCircle,
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  X,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import type { Order, Product } from '@/types'
import { supabase } from '@/lib/supabase'

interface AdminProps {
  onNavigate: (page: string) => void
}

type Tab = 'dashboard' | 'products' | 'orders'

const EMPTY_FORM: Partial<Product> = {
  name: '',
  price: 0,
  stock: 0,
  image_url: '',
  description: '',
  active: true,
  // @ts-ignore
  category: 'Unisex' 
}

export function Admin({ onNavigate }: AdminProps) {
  // --- Auth Supabase ---
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) 
  const [loginLoading, setLoginLoading] = useState(false) 
  
  // Login Inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // --- Tabs / data ---
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // --- Products (Supabase) ---
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  // --- 1. Verificar sesión activa al iniciar ---
  useEffect(() => {
    checkSession()
    
    // Cargar pedidos locales
    const savedOrders = localStorage.getItem('aromas_orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))
  }, [])

  const checkSession = async () => {
    setAuthLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      const isAdmin = await verifyAdminRole(session.user.id)
      if (isAdmin) {
        setIsLoggedIn(true)
      } else {
        await supabase.auth.signOut() 
      }
    }
    setAuthLoading(false)
  }

  const verifyAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error || !data) return false
      return data.role === 'admin'
    } catch (e) {
      console.error(e)
      return false
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn) return
    if (activeTab === 'products') fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isLoggedIn])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const isAdmin = await verifyAdminRole(data.user.id)
        
        if (isAdmin) {
          setIsLoggedIn(true)
        } else {
          alert('Acceso denegado: Este usuario no tiene permisos de administrador.')
          await supabase.auth.signOut()
        }
      }
    } catch (error: any) {
      alert('Error al iniciar sesión: ' + (error.message || 'Credenciales incorrectas'))
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setActiveTab('dashboard')
    setSelectedOrder(null)
  }

  // --- Orders (local + Resta de Stock en Supabase) ---
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // 1. Encontrar la orden actual
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    // 2. LÓGICA DE STOCK: Si pasa a 'paid' (Pagado), restamos el stock en Supabase
    if (newStatus === 'paid' && currentOrder.status === 'pending') {
        try {
            // Recorremos los items de la orden
            for (const item of currentOrder.items) {
                // Buscamos el producto actual en la BD para saber su stock real
                const { data: productData, error: fetchError } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.id)
                    .single();
                
                if (fetchError) {
                    console.error(`Error obteniendo stock del producto ${item.id}:`, fetchError);
                    continue; // Saltar al siguiente si hay error
                }

                // Calculamos el nuevo stock (evitando que baje de 0)
                const newStock = Math.max(0, productData.stock - item.quantity);

                // Actualizamos el stock en Supabase
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ stock: newStock })
                    .eq('id', item.id);

                if (updateError) {
                    console.error(`Error actualizando stock del producto ${item.id}:`, updateError);
                }
            }
            
            // Recargamos los productos en el panel para ver el nuevo stock
            fetchProducts();
            alert(`Stock descontado correctamente para el pedido ${orderId}`);
            
        } catch (err) {
            console.error('Error general actualizando stock:', err);
            alert('Hubo un error al intentar descontar el stock.');
        }
    }

    // 3. Actualizamos el estado visual de la orden (Local)
    const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    setOrders(updatedOrders)
    localStorage.setItem('aromas_orders', JSON.stringify(updatedOrders))

    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  // --- Products (Supabase) ---
  const fetchProducts = async () => {
    setLoadingProducts(true)
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, stock, image_url, description, active, category')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando productos:', error)
      setLoadingProducts(false)
      return
    }

    setProducts((data || []) as Product[])
    setLoadingProducts(false)
  }

  const openCreate = () => {
    setEditingId(null)
    setFormData({ ...EMPTY_FORM })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEdit = (p: Product) => {
    setEditingId(p.id)
    setFormData({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      image_url: p.image_url,
      description: p.description,
      active: p.active,
      // @ts-ignore
      category: (p as any).category || 'Unisex' 
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ ...EMPTY_FORM })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) throw new Error('Debes seleccionar una imagen.')

      const ext = file.name.split('.').pop() || 'png'
      const fileName = `${crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file, {
        upsert: true,
      })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      const publicUrl = data?.publicUrl || ''

      setFormData((prev) => ({ ...prev, image_url: publicUrl }))
    } catch (err) {
      console.error(err)
      alert('Error subiendo imagen. Verifica que exista el bucket product-images y permisos.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: any = {
      name: (formData.name || '').trim(),
      price: Number(formData.price || 0),
      stock: Number(formData.stock || 0),
      image_url: (formData.image_url || '').trim(),
      description: (formData.description || '').trim() || undefined,
      active: formData.active ?? true,
      category: (formData as any).category || 'Unisex'
    }

    if (!payload.name) return alert('Nombre es obligatorio.')
    if (Number.isNaN(payload.price) || payload.price < 0) return alert('Precio inválido.')
    if (Number.isNaN(payload.stock) || payload.stock < 0) return alert('Stock inválido.')

    setSavingProduct(true)
    try {
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId)
        if (error) throw error
        alert('Producto actualizado')
      } else {
        const { error } = await supabase.from('products').insert([payload])
        if (error) throw error
        alert('Producto creado')
      }

      closeForm()
      await fetchProducts()
    } catch (err) {
      console.error(err)
      alert('Error guardando el producto. Revisa consola.')
    } finally {
      setSavingProduct(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Seguro que quieres borrar este producto?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error(error)
      return alert('Error borrando. Revisa consola.')
    }
    await fetchProducts()
  }

  const handleToggleActive = async (p: Product) => {
    const { error } = await supabase.from('products').update({ active: !p.active }).eq('id', p.id)
    if (error) {
      console.error(error)
      return alert('Error cambiando estado. Revisa consola.')
    }
    await fetchProducts()
  }

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, productSearch])

  // --- Stats ---
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const lowStockProducts = products.filter((p) => p.stock < 10).length

  // --- VISTA DE LOGIN ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D7A04D]" size={40} />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#F4F2EE] mb-2">AROMAS</h1>
            <p className="text-[#B9B2A6]">Panel de Administración</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 bg-[#141416] border border-[#2A2A2C] rounded-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-[#B9B2A6] text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark w-full"
                  placeholder="admin@aromas.cl"
                  required
                />
              </div>
              <div>
                <label className="block text-[#B9B2A6] text-sm mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark w-full"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loginLoading}
                className="w-full btn-gold py-4 flex items-center justify-center gap-2"
              >
                {loginLoading && <Loader2 className="animate-spin" size={20} />}
                {loginLoading ? 'Verificando...' : 'Iniciar sesión'}
              </button>
            </div>
            <p className="text-[#666] text-xs text-center mt-6">
              Acceso restringido solo para administradores.
            </p>
          </form>

          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-4 text-[#B9B2A6] hover:text-[#D7A04D] transition-colors"
          >
            Volver al sitio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#141416] border-r border-[#2A2A2C] hidden lg:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#F4F2EE]">AROMAS</h1>
          <p className="text-[#666] text-sm">Panel Admin</p>
        </div>

        <nav className="px-4 py-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-[#D7A04D]/20 text-[#D7A04D]' : 'text-[#B9B2A6] hover:bg-[#2A2A2C]'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              activeTab === 'products' ? 'bg-[#D7A04D]/20 text-[#D7A04D]' : 'text-[#B9B2A6] hover:bg-[#2A2A2C]'
            }`}
          >
            <Package size={20} />
            Productos
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              activeTab === 'orders' ? 'bg-[#D7A04D]/20 text-[#D7A04D]' : 'text-[#B9B2A6] hover:bg-[#2A2A2C]'
            }`}
          >
            <ShoppingCart size={20} />
            Pedidos
            {pendingOrders > 0 && (
              <span className="ml-auto w-5 h-5 bg-[#D7A04D] text-[#0B0B0C] text-xs font-bold rounded-full flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#B9B2A6] hover:text-[#D7A04D] transition-colors"
          >
            <Eye size={20} />
            Ver sitio
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#B9B2A6] hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#141416] border-b border-[#2A2A2C] z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-[#F4F2EE]">AROMAS Admin</h1>
          <button onClick={handleLogout} className="text-[#B9B2A6]">
            <LogOut size={20} />
          </button>
        </div>
        <div className="flex border-t border-[#2A2A2C]">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'products', icon: Package, label: 'Productos' },
            { id: 'orders', icon: ShoppingCart, label: 'Pedidos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm ${
                activeTab === tab.id ? 'text-[#D7A04D] border-b-2 border-[#D7A04D]' : 'text-[#B9B2A6]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 lg:pt-0 min-h-screen">
        {/* Top Bar */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-[#2A2A2C]">
          <h2 className="text-xl font-semibold text-[#F4F2EE]">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'products' && 'Gestión de Productos (Supabase)'}
            {activeTab === 'orders' && 'Gestión de Pedidos'}
          </h2>

          {activeTab === 'products' && (
            <div className="flex items-center gap-3">
              <button
                onClick={fetchProducts}
                className="px-4 py-2 rounded-lg border border-[#2A2A2C] text-[#B9B2A6] hover:text-[#D7A04D] hover:border-[#D7A04D]/40 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Recargar
              </button>
              <button onClick={openCreate} className="btn-gold px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus size={18} />
                Nuevo producto
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#D7A04D]/20 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="text-[#D7A04D]" size={24} />
                    </div>
                    <span className="text-green-500 text-sm flex items-center gap-1">
                      <TrendingUp size={14} />
                      +12%
                    </span>
                  </div>
                  <p className="text-[#B9B2A6] text-sm">Total Pedidos</p>
                  <p className="text-2xl font-bold text-[#F4F2EE]">{totalOrders}</p>
                </div>

                <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#D7A04D]/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-[#D7A04D]" size={24} />
                    </div>
                    <span className="text-green-500 text-sm flex items-center gap-1">
                      <TrendingUp size={14} />
                      +8%
                    </span>
                  </div>
                  <p className="text-[#B9B2A6] text-sm">Ingresos</p>
                  <p className="text-2xl font-bold text-[#F4F2EE]">${totalRevenue.toLocaleString('es-CL')}</p>
                </div>

                <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-orange-500" size={24} />
                    </div>
                  </div>
                  <p className="text-[#B9B2A6] text-sm">Pendientes</p>
                  <p className="text-2xl font-bold text-[#F4F2EE]">{pendingOrders}</p>
                </div>

                <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Box className="text-red-500" size={24} />
                    </div>
                  </div>
                  <p className="text-[#B9B2A6] text-sm">Stock Bajo</p>
                  <p className="text-2xl font-bold text-[#F4F2EE]">{lowStockProducts}</p>
                </div>
              </div>

              <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#F4F2EE]">Pedidos Recientes</h3>
                </div>

                {orders.length === 0 ? (
                  <p className="text-[#666] text-center py-8">No hay pedidos aún</p>
                ) : (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#2A2A2C]">
                          <th className="text-left py-3 text-[#B9B2A6] text-sm font-medium">ID</th>
                          <th className="text-left py-3 text-[#B9B2A6] text-sm font-medium">Cliente</th>
                          <th className="text-left py-3 text-[#B9B2A6] text-sm font-medium">Total</th>
                          <th className="text-left py-3 text-[#B9B2A6] text-sm font-medium">Estado</th>
                          <th className="text-left py-3 text-[#B9B2A6] text-sm font-medium">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-[#2A2A2C]/50">
                            <td className="py-3 text-[#F4F2EE] text-sm">{order.id}</td>
                            <td className="py-3 text-[#F4F2EE] text-sm">{order.customer.name}</td>
                            <td className="py-3 text-[#D7A04D] text-sm font-medium">
                              ${order.total.toLocaleString('es-CL')}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  order.status === 'pending'
                                    ? 'bg-orange-500/20 text-orange-500'
                                    : order.status === 'paid'
                                    ? 'bg-blue-500/20 text-blue-500'
                                    : order.status === 'shipped'
                                    ? 'bg-purple-500/20 text-purple-500'
                                    : order.status === 'delivered'
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-red-500/20 text-red-500'
                                }`}
                              >
                                {order.status === 'pending'
                                  ? 'Pendiente'
                                  : order.status === 'paid'
                                  ? 'Pagado'
                                  : order.status === 'shipped'
                                  ? 'Enviado'
                                  : order.status === 'delivered'
                                  ? 'Entregado'
                                  : 'Cancelado'}
                              </span>
                            </td>
                            <td className="py-3 text-[#B9B2A6] text-sm">
                              {new Date(order.createdAt).toLocaleDateString('es-CL')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products (Supabase CRUD) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Form */}
              {showForm && (
                <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#F4F2EE]">
                      {editingId ? 'Editar producto' : 'Nuevo producto'}
                    </h3>
                    <button onClick={closeForm} className="text-[#B9B2A6] hover:text-[#D7A04D]">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Nombre</label>
                      <input
                        className="input-dark w-full"
                        value={formData.name ?? ''}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                        <label className="block text-[#B9B2A6] text-sm mb-2">Categoría / Género</label>
                        <select
                            className="input-dark w-full"
                            // @ts-ignore
                            value={(formData as any).category || 'Unisex'}
                            // @ts-ignore
                            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                        >
                            <option value="Mujer">Mujer</option>
                            <option value="Hombre">Hombre</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>

                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Precio (CLP)</label>
                      <input
                        type="number"
                        className="input-dark w-full"
                        value={Number(formData.price ?? 0)}
                        onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                        required
                        min={0}
                      />
                    </div>

                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Stock</label>
                      <input
                        type="number"
                        className="input-dark w-full"
                        value={Number(formData.stock ?? 0)}
                        onChange={(e) => setFormData((p) => ({ ...p, stock: Number(e.target.value) }))}
                        required
                        min={0}
                      />
                    </div>

                    <div>
                      <label className="block text-[#B9B2A6] text-sm mb-2">Activo</label>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, active: !(p.active ?? true) }))}
                        className="w-full flex items-center justify-between bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg px-4 py-3 text-[#F4F2EE]"
                      >
                        <span className="text-sm">{formData.active ? 'Visible en tienda' : 'Oculto'}</span>
                        {formData.active ? <ToggleRight className="text-[#D7A04D]" /> : <ToggleLeft className="text-[#666]" />}
                      </button>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-[#B9B2A6] text-sm mb-2">Descripción</label>
                      <textarea
                        className="input-dark w-full min-h-[90px]"
                        value={formData.description ?? ''}
                        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-[#B9B2A6] text-sm mb-2">Imagen</label>
                      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2A2A2C] text-[#B9B2A6] hover:text-[#D7A04D] hover:border-[#D7A04D]/40 cursor-pointer transition-colors">
                          <ImageIcon size={18} />
                          <span className="text-sm">{uploading ? 'Subiendo...' : 'Subir imagen'}</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                        </label>

                        {formData.image_url ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={formData.image_url}
                              alt="preview"
                              className="w-14 h-14 object-cover rounded-lg border border-[#2A2A2C]"
                            />
                            <span className="text-xs text-[#666] break-all max-w-[520px]">{formData.image_url}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#666]">Sin imagen aún</span>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-2 flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingProduct || uploading}
                        className="btn-gold px-6 py-3 rounded-lg disabled:opacity-60"
                      >
                        {savingProduct ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                      </button>
                      <button
                        type="button"
                        onClick={closeForm}
                        className="px-6 py-3 rounded-lg border border-[#2A2A2C] text-[#B9B2A6] hover:text-[#D7A04D] hover:border-[#D7A04D]/40 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Header row */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="input-dark pl-12 w-72"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#B9B2A6] text-sm">{filteredProducts.length} productos</span>
                  <button onClick={openCreate} className="btn-gold px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={18} />
                    Nuevo
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2A2A2C]">
                      <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Producto</th>
                      <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Categoría</th>
                      <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Precio</th>
                      <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Stock</th>
                      <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Estado</th>
                      <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loadingProducts ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#666]">
                          Cargando productos...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#666]">
                          No hay productos. Crea el primero.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-[#2A2A2C]/50 hover:bg-[#141416]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image_url || 'https://via.placeholder.com/80?text=Aromas'}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded border border-[#2A2A2C]"
                              />
                              <div className="flex flex-col">
                                <span className="text-[#F4F2EE] text-sm">{product.name}</span>
                                {product.description ? (
                                  <span className="text-[#666] text-xs line-clamp-1 max-w-[520px]">{product.description}</span>
                                ) : (
                                  <span className="text-[#666] text-xs">Sin descripción</span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-[#B9B2A6] text-sm">
                             {(product as any).category || 'Unisex'}
                          </td>

                          <td className="py-3 px-4 text-[#D7A04D] text-sm font-medium">
                            ${Number(product.price).toLocaleString('es-CL')}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[#F4F2EE] text-sm">{product.stock}</span>
                              {product.stock < 10 && <AlertCircle className="text-red-500" size={16} />}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleActive(product)}
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs border transition-colors ${
                                product.active
                                  ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/15'
                                  : 'border-[#2A2A2C] bg-[#0B0B0C] text-[#B9B2A6] hover:border-[#D7A04D]/30'
                              }`}
                              title="Activar / Desactivar"
                            >
                              {product.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                              {product.active ? 'Activo' : 'Oculto'}
                            </button>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(product)}
                                className="text-[#D7A04D] hover:text-[#E5B86A] transition-colors"
                                title="Editar"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                                title="Borrar"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[#666]">
                * Productos se cargan desde Supabase (tabla <code className="text-[#B9B2A6]">products</code>). Imágenes desde Storage bucket{' '}
                <code className="text-[#B9B2A6]">product-images</code>.
              </p>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {selectedOrder ? (
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-[#B9B2A6] hover:text-[#D7A04D]"
                  >
                    <ChevronLeft size={18} />
                    Volver a pedidos
                  </button>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                      <h3 className="text-lg font-semibold text-[#F4F2EE] mb-4">Detalles del Pedido</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[#B9B2A6] text-sm">ID del Pedido</p>
                          <p className="text-[#F4F2EE] font-mono">{selectedOrder.id}</p>
                        </div>
                        <div>
                          <p className="text-[#B9B2A6] text-sm">Fecha</p>
                          <p className="text-[#F4F2EE]">{new Date(selectedOrder.createdAt).toLocaleString('es-CL')}</p>
                        </div>
                        <div>
                          <p className="text-[#B9B2A6] text-sm">Total</p>
                          <p className="text-[#D7A04D] text-xl font-bold">${selectedOrder.total.toLocaleString('es-CL')}</p>
                        </div>
                        <div>
                          <p className="text-[#B9B2A6] text-sm mb-2">Estado</p>
                          <div className="flex flex-wrap gap-2">
                            {(['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                className={`px-3 py-1 rounded text-sm ${
                                  selectedOrder.status === status
                                    ? status === 'pending'
                                      ? 'bg-orange-500 text-white'
                                      : status === 'paid'
                                      ? 'bg-blue-500 text-white'
                                      : status === 'shipped'
                                      ? 'bg-purple-500 text-white'
                                      : status === 'delivered'
                                      ? 'bg-green-500 text-white'
                                      : 'bg-red-500 text-white'
                                    : 'bg-[#2A2A2C] text-[#B9B2A6] hover:bg-[#D7A04D]/10'
                                }`}
                              >
                                {status === 'pending'
                                  ? 'Pendiente'
                                  : status === 'paid'
                                  ? 'Pagado'
                                  : status === 'shipped'
                                  ? 'Enviado'
                                  : status === 'delivered'
                                  ? 'Entregado'
                                  : 'Cancelado'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                      <h3 className="text-lg font-semibold text-[#F4F2EE] mb-4">Información del Cliente</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[#B9B2A6] text-sm">Nombre</p>
                          <p className="text-[#F4F2EE]">{selectedOrder.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-[#B9B2A6] text-sm">Email</p>
                          <p className="text-[#F4F2EE]">{selectedOrder.customer.email}</p>
                        </div>
                        <div>
                          <p className="text-[#B9B2A6] text-sm">Teléfono</p>
                          <p className="text-[#F4F2EE]">{selectedOrder.customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-[#B9B2A6] text-sm">Dirección</p>
                          <p className="text-[#F4F2EE]">{selectedOrder.customer.address}</p>
                          <p className="text-[#F4F2EE]">
                            {selectedOrder.customer.city}, {selectedOrder.customer.region}
                          </p>
                        </div>
                        {/* AQUI ESTABA EL ERROR: Agregamos "as any" para evitar que TypeScript llore */}
                        {(selectedOrder.customer as any).notes && (
                            <div>
                                <p className="text-[#B9B2A6] text-sm">Notas</p>
                                <p className="text-[#F4F2EE] italic">"{(selectedOrder.customer as any).notes}"</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#141416] border border-[#2A2A2C] rounded-xl">
                    <h3 className="text-lg font-semibold text-[#F4F2EE] mb-4">Productos</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: any, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-[#0B0B0C] rounded-lg border border-[#2A2A2C]">
                          <img
                            src={item.image_url || item.image || 'https://via.placeholder.com/100?text=Aromas'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-[#F4F2EE] font-medium">{item.name}</p>
                            <p className="text-[#666] text-sm line-clamp-1">{item.description || '—'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#F4F2EE]">x{item.quantity}</p>
                            <p className="text-[#D7A04D] font-medium">
                              ${Number(item.price * item.quantity).toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
                      <input type="text" placeholder="Buscar pedidos..." className="input-dark pl-12 w-64" />
                    </div>
                    <span className="text-[#B9B2A6] text-sm">{orders.length} pedidos</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-12 bg-[#141416] border border-[#2A2A2C] rounded-xl text-center">
                      <ShoppingCart size={64} className="mx-auto text-[#2A2A2C] mb-4" />
                      <p className="text-[#B9B2A6]">No hay pedidos aún</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#2A2A2C]">
                            <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">ID</th>
                            <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Cliente</th>
                            <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Items</th>
                            <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Total</th>
                            <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Estado</th>
                            <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Fecha</th>
                            <th className="text-left py-3 px-4 text-[#B9B2A6] text-sm font-medium">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} className="border-b border-[#2A2A2C]/50 hover:bg-[#141416]">
                              <td className="py-3 px-4 text-[#F4F2EE] text-sm font-mono">{order.id}</td>
                              <td className="py-3 px-4 text-[#F4F2EE] text-sm">{order.customer.name}</td>
                              <td className="py-3 px-4 text-[#B9B2A6] text-sm">{order.items.length}</td>
                              <td className="py-3 px-4 text-[#D7A04D] text-sm font-medium">
                                ${order.total.toLocaleString('es-CL')}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    order.status === 'pending'
                                      ? 'bg-orange-500/20 text-orange-500'
                                      : order.status === 'paid'
                                      ? 'bg-blue-500/20 text-blue-500'
                                      : order.status === 'shipped'
                                      ? 'bg-purple-500/20 text-purple-500'
                                      : order.status === 'delivered'
                                      ? 'bg-green-500/20 text-green-500'
                                      : 'bg-red-500/20 text-red-500'
                                  }`}
                                >
                                  {order.status === 'pending'
                                    ? 'Pendiente'
                                    : order.status === 'paid'
                                    ? 'Pagado'
                                    : order.status === 'shipped'
                                    ? 'Enviado'
                                    : order.status === 'delivered'
                                    ? 'Entregado'
                                    : 'Cancelado'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-[#B9B2A6] text-sm">
                                {new Date(order.createdAt).toLocaleDateString('es-CL')}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-[#D7A04D] hover:text-[#E5B86A] transition-colors"
                                >
                                  <Eye size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}