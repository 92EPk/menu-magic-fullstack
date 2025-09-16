import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  DollarSign,
  Package,
  Tag,
  Gift,
  ShoppingBag
} from 'lucide-react';
import { useRestaurant } from '@/hooks/useRestaurant';
import type { SimpleCategory, SimpleMenuItem, SimpleOffer, CustomizationOption } from '@/types/restaurant';

const SimpleMenuManager = () => {
  const {
    categories,
    menuItems,
    offers,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addOffer,
    updateOffer,
    deleteOffer
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState('categories');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Category Dialog Component
  const CategoryDialog = () => {
    const [formData, setFormData] = useState<Partial<SimpleCategory>>(
      editingItem || {
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        sort_order: 0,
        is_active: true
      }
    );

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingItem) {
        await updateCategory(editingItem.id, formData);
      } else {
        await addCategory(formData);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    };

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name_ar">Arabic Name</Label>
            <Input
              id="name_ar"
              value={formData.name_ar || ''}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="name_en">English Name</Label>
            <Input
              id="name_en"
              value={formData.name_en || ''}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="desc_ar">Arabic Description</Label>
            <Textarea
              id="desc_ar"
              value={formData.description_ar || ''}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="desc_en">English Description</Label>
            <Textarea
              id="desc_en"
              value={formData.description_en || ''}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active || false}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingItem ? 'Update' : 'Add'} Category
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    );
  };

  // Menu Item Dialog Component
  const MenuItemDialog = () => {
    const [formData, setFormData] = useState<Partial<SimpleMenuItem>>(
      editingItem || {
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        price: 0,
        category_id: '',
        prep_time: '15-20',
        is_spicy: false,
        is_offer: false,
        is_available: true,
        is_featured: false,
        sort_order: 0,
        customization_options: []
      }
    );

    const [customOptions, setCustomOptions] = useState<CustomizationOption[]>(
      formData.customization_options || []
    );

    const addCustomOption = () => {
      const newOption: CustomizationOption = {
        id: Date.now().toString(),
        name_ar: '',
        name_en: '',
        price: 0,
        type: 'addon'
      };
      setCustomOptions([...customOptions, newOption]);
    };

    const updateCustomOption = (index: number, updates: Partial<CustomizationOption>) => {
      const updated = [...customOptions];
      updated[index] = { ...updated[index], ...updates };
      setCustomOptions(updated);
    };

    const removeCustomOption = (index: number) => {
      setCustomOptions(customOptions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const finalData = { ...formData, customization_options: customOptions };
      
      if (editingItem) {
        await updateMenuItem(editingItem.id, finalData);
      } else {
        await addMenuItem(finalData);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    };

    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name_ar">Arabic Name</Label>
              <Input
                id="name_ar"
                value={formData.name_ar || ''}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="name_en">English Name</Label>
              <Input
                id="name_en"
                value={formData.name_en || ''}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id || ''}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name_en} ({cat.name_ar})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="prep_time">Prep Time</Label>
              <Input
                id="prep_time"
                value={formData.prep_time || ''}
                onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="desc_ar">Arabic Description</Label>
              <Textarea
                id="desc_ar"
                value={formData.description_ar || ''}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="desc_en">English Description</Label>
              <Textarea
                id="desc_en"
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_available || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
              />
              <Label>Available</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_featured || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label>Featured</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_spicy || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_spicy: checked })}
              />
              <Label>Spicy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_offer || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_offer: checked })}
              />
              <Label>On Offer</Label>
            </div>
          </div>

          {/* Customization Options */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Customization Options</Label>
              <Button type="button" size="sm" onClick={addCustomOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {customOptions.map((option, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Arabic name"
                      value={option.name_ar}
                      onChange={(e) => updateCustomOption(index, { name_ar: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="English name"
                      value={option.name_en}
                      onChange={(e) => updateCustomOption(index, { name_en: e.target.value })}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={option.price}
                      onChange={(e) => updateCustomOption(index, { price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <Select
                    value={option.type}
                    onValueChange={(value: any) => updateCustomOption(index, { type: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="size">Size</SelectItem>
                      <SelectItem value="addon">Add-on</SelectItem>
                      <SelectItem value="sauce">Sauce</SelectItem>
                      <SelectItem value="drink">Drink</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingItem ? 'Update' : 'Add'} Menu Item
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <Badge variant="secondary">
          {menuItems.length} items across {categories.length} categories
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Menu Items ({menuItems.length})
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Special Offers ({offers.length})
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Categories</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <CategoryDialog />
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{category.name_en}</h4>
                        <p className="text-sm text-muted-foreground">{category.name_ar}</p>
                      </div>
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditingItem(category); setIsDialogOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Menu Items Tab */}
        <TabsContent value="menu" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Menu Items</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <MenuItemDialog />
            </Dialog>
          </div>

          <div className="grid gap-4">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.name_en}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{item.name_en}</h4>
                          <Badge variant="outline" className="text-xs">
                            {item.category_info.name_en}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.name_ar}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {item.price}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {item.rating}
                          </span>
                          {item.customization_options.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {item.customization_options.length} options
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {item.is_featured && <Badge variant="default">Featured</Badge>}
                          {item.is_spicy && <Badge variant="destructive">Spicy</Badge>}
                          {item.is_offer && <Badge variant="secondary">On Offer</Badge>}
                          <Badge variant={item.is_available ? 'default' : 'outline'}>
                            {item.is_available ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMenuItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">
                  {categories.filter(c => c.is_active).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{menuItems.length}</div>
                <p className="text-xs text-muted-foreground">
                  {menuItems.filter(i => i.is_available).length} available
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {menuItems.filter(i => i.is_featured).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Special Offers</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{offers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {offers.filter(o => o.is_active).length} active
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleMenuManager;