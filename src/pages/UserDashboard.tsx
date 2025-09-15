import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  Bell, 
  Star,
  LogOut,
  Settings,
  Package,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold">My Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Welcome back!</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingBag className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-6 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Recent Orders</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You haven't placed any orders yet. Start exploring our menu!
                      </p>
                      <Button size="sm" onClick={() => navigate('/menu')}>
                        Browse Menu
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-6 text-center">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Favorite Items</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Save your favorite dishes for quick access
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('favorites')}>
                        View Favorites
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-6 text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Add Address</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add your delivery addresses for faster checkout
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('addresses')}>
                        Manage Addresses
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Profile management features coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Order History
                    </CardTitle>
                    <CardDescription>
                      View and track your past orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        When you place your first order, it will appear here
                      </p>
                      <Button onClick={() => navigate('/menu')}>
                        Start Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="mr-2 h-5 w-5" />
                      Favorite Items
                    </CardTitle>
                    <CardDescription>
                      Your saved favorite dishes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Save your favorite dishes for easy reordering
                      </p>
                      <Button onClick={() => navigate('/menu')}>
                        Browse Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Delivery Addresses
                    </CardTitle>
                    <CardDescription>
                      Manage your delivery locations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Addresses Saved</h3>
                      <p className="text-muted-foreground mb-4">
                        Add delivery addresses for faster checkout
                      </p>
                      <Button>
                        Add New Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Stay updated with your orders and offers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                      <p className="text-muted-foreground">
                        You're all caught up!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;