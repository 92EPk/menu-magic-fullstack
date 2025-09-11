import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Bell,
  FolderPlus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCategories, useMenuItems, useOrders, Category, MenuItem } from "@/hooks/useDatabase";
import CategoryDialog from "@/components/admin/CategoryDialog";
import MenuItemDialog from "@/components/admin/MenuItemDialog";
import AdminProfile from "@/components/admin/AdminProfile";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Database hooks
  const { categories, loading: categoriesLoading, addCategory, updateCategory, deleteCategory } = useCategories();
  const { menuItems, loading: menuItemsLoading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();
  
  // Dialog states
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category?: Category | null }>({ open: false });
  const [menuItemDialog, setMenuItemDialog] = useState<{ open: boolean; menuItem?: MenuItem | null }>({ open: false });
  
  // Calculate stats from real data
  const stats = {
    totalOrders: orders.length,
    totalProducts: menuItems.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length
  };

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("admin-token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لك على استخدام لوحة التحكم",
    });
    navigate("/admin/login");
  };

  // Order management functions
  const handleViewOrder = (orderId: string) => {
    toast({
      title: "عرض الطلب",
      description: `عرض تفاصيل الطلب #${orderId.slice(0, 8)}`,
    });
  };

  const handleEditOrder = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Category management functions
  const handleAddCategory = () => {
    setCategoryDialog({ open: true, category: null });
  };

  const handleEditCategory = (category: Category) => {
    setCategoryDialog({ open: true, category });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleSaveCategory = async (categoryData: any) => {
    try {
      if (categoryDialog.category) {
        await updateCategory(categoryDialog.category.id, categoryData);
      } else {
        await addCategory(categoryData);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Product management functions
  const handleAddProduct = () => {
    setMenuItemDialog({ open: true, menuItem: null });
  };

  const handleEditProduct = (menuItem: MenuItem) => {
    setMenuItemDialog({ open: true, menuItem });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await deleteMenuItem(productId);
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleSaveMenuItem = async (itemData: any) => {
    try {
      if (menuItemDialog.menuItem) {
        await updateMenuItem(menuItemDialog.menuItem.id, itemData);
      } else {
        await addMenuItem(itemData);
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };


  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">في الانتظار</Badge>;
      case "preparing":
        return <Badge className="bg-blue-500">قيد التحضير</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">تم التوصيل</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">لوحة تحكم Mix & Taste</h1>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              متصل
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 ml-2" />
              الإشعارات
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8" dir="rtl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">في 6 فئات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalRevenue.toLocaleString()} جنيه</div>
              <p className="text-xs text-muted-foreground">+8% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات معلقة</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">تحتاج إلى اهتمام</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">إدارة الطلبات</TabsTrigger>
            <TabsTrigger value="products">إدارة المنتجات</TabsTrigger>
            <TabsTrigger value="categories">إدارة التصنيفات</TabsTrigger>
            <TabsTrigger value="analytics">التقارير</TabsTrigger>
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الطلبات الحديثة</CardTitle>
                <CardDescription>إدارة جميع طلبات العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">جاري تحميل الطلبات...</div>
                  </div>
                ) : (
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">الطلب #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="font-bold text-primary">{order.total_amount} جنيه</p>
                          {getOrderStatusBadge(order.status)}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewOrder(order.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <select 
                            value={order.status} 
                            onChange={(e) => handleEditOrder(order.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="pending">في الانتظار</option>
                            <option value="confirmed">مؤكد</option>
                            <option value="preparing">قيد التحضير</option>
                            <option value="ready">جاهز</option>
                            <option value="delivered">تم التوصيل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>إدارة المنتجات</CardTitle>
                  <CardDescription>إضافة وتعديل منتجات المطعم</CardDescription>
                </div>
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منتج جديد
                </Button>
              </CardHeader>
              <CardContent>
                {menuItemsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">جاري تحميل المنتجات...</div>
                  </div>
                ) : (
                <div className="space-y-4">
                  {menuItems.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                          {product.image_url && (
                            <img src={product.image_url} alt={product.name_ar} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name_ar}</p>
                          <p className="text-sm text-muted-foreground">{product.category?.name_ar}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="font-bold text-primary">{product.price} جنيه</p>
                          {product.discount_price && (
                            <p className="text-sm text-muted-foreground line-through">{product.discount_price} جنيه</p>
                          )}
                          <Badge variant={product.is_available ? "default" : "secondary"}>
                            {product.is_available ? "متاح" : "غير متاح"}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>إدارة التصنيفات</CardTitle>
                  <CardDescription>إضافة وتعديل تصنيفات القائمة</CardDescription>
                </div>
                <Button onClick={handleAddCategory}>
                  <FolderPlus className="h-4 w-4 ml-2" />
                  إضافة تصنيف جديد
                </Button>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">جاري تحميل التصنيفات...</div>
                  </div>
                ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                          {category.image_url && (
                            <img src={category.image_url} alt={category.name_ar} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{category.name_ar}</p>
                          <p className="text-sm text-muted-foreground">{category.description_ar}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <Badge variant={category.is_active ? "default" : "secondary"}>
                            {category.is_active ? "نشط" : "غير نشط"}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>أداء المبيعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    سيتم إضافة الرسوم البيانية قريباً
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>برجر مخصوص</span>
                      <Badge>45 طلب</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>بيتزا مارجريتا</span>
                      <Badge>32 طلب</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>دجاج حار مقلي</span>
                      <Badge>28 طلب</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <AdminProfile />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <CategoryDialog
          isOpen={categoryDialog.open}
          onOpenChange={(open) => setCategoryDialog({ open, category: null })}
          category={categoryDialog.category}
          onSave={handleSaveCategory}
          loading={categoriesLoading}
        />

        <MenuItemDialog
          isOpen={menuItemDialog.open}
          onOpenChange={(open) => setMenuItemDialog({ open, menuItem: null })}
          menuItem={menuItemDialog.menuItem}
          categories={categories}
          onSave={handleSaveMenuItem}
          loading={menuItemsLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;