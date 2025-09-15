import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Copy,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  Tag,
  Settings,
  Move3D
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCustomizationOptions, useCategories, CustomizationOption, Category } from "@/hooks/useDatabase";
import { useToast } from "@/components/ui/use-toast";

// Enhanced Option Type System
const OPTION_TYPES = {
  bread: { 
    label_ar: 'العيش', 
    label_en: 'Bread', 
    icon: '🍞',
    pricing_model: 'fixed' // fixed, percentage, multiplier
  },
  sauce: { 
    label_ar: 'الصوص', 
    label_en: 'Sauce', 
    icon: '🍯',
    pricing_model: 'fixed'
  },
  presentation: { 
    label_ar: 'طريقة التقديم', 
    label_en: 'Presentation', 
    icon: '🍽️',
    pricing_model: 'fixed'
  },
  pasta_sauce: { 
    label_ar: 'صوص المكرونة', 
    label_en: 'Pasta Sauce', 
    icon: '🍝',
    pricing_model: 'fixed'
  },
  size: { 
    label_ar: 'الحجم', 
    label_en: 'Size', 
    icon: '📏',
    pricing_model: 'multiplier'
  },
  extras: { 
    label_ar: 'إضافات', 
    label_en: 'Extras', 
    icon: '➕',
    pricing_model: 'fixed'
  },
  spice_level: { 
    label_ar: 'مستوى الحرارة', 
    label_en: 'Spice Level', 
    icon: '🌶️',
    pricing_model: 'fixed'
  },
  drink_size: { 
    label_ar: 'حجم المشروب', 
    label_en: 'Drink Size', 
    icon: '🥤',
    pricing_model: 'multiplier'
  },
  cooking_level: { 
    label_ar: 'درجة النضج', 
    label_en: 'Cooking Level', 
    icon: '🔥',
    pricing_model: 'fixed'
  },
  toppings: { 
    label_ar: 'الإضافات العلوية', 
    label_en: 'Toppings', 
    icon: '🧀',
    pricing_model: 'fixed'
  }
};

interface SortableOptionItemProps {
  option: CustomizationOption;
  onEdit: (option: CustomizationOption) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDuplicate: (option: CustomizationOption) => void;
}

const SortableOptionItem = ({ option, onEdit, onDelete, onToggleActive, onDuplicate }: SortableOptionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const optionTypeInfo = OPTION_TYPES[option.option_type as keyof typeof OPTION_TYPES];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-all ${
        isDragging ? 'shadow-lg border-primary' : ''
      } ${!option.is_active ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Option Info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">{optionTypeInfo?.icon || '⚙️'}</span>
            <Badge variant="outline" className="text-xs">
              {option.sort_order}
            </Badge>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{option.name_ar}</h4>
              <span className="text-muted-foreground">({option.name_en})</span>
              {option.is_required && (
                <Badge variant="destructive" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  مطلوب
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {optionTypeInfo?.label_ar || option.option_type}
              </Badge>
              
              {option.price > 0 && (
                <Badge className="text-xs bg-green-100 text-green-800">
                  <DollarSign className="h-3 w-3 mr-1" />
                  +{option.price} جنيه
                </Badge>
              )}
              
              {option.price === 0 && (
                <Badge variant="outline" className="text-xs">
                  مجاني
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Active Status Toggle */}
        <Switch
          checked={option.is_active}
          onCheckedChange={(checked) => onToggleActive(option.id, checked)}
          className="data-[state=checked]:bg-green-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDuplicate(option)}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(option)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(option.id)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface OptionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  option: CustomizationOption | null;
  selectedCategoryId: string;
}

const OptionFormDialog = ({ isOpen, onClose, option, selectedCategoryId }: OptionFormDialogProps) => {
  const [formData, setFormData] = useState({
    category_id: selectedCategoryId,
    option_type: '',
    name_ar: '',
    name_en: '',
    price: 0,
    is_required: false,
    is_active: true,
    sort_order: 0,
    pricing_model: 'fixed' as 'fixed' | 'percentage' | 'multiplier'
  });

  const { addCustomizationOption, updateCustomizationOption } = useCustomizationOptions();
  const { categories } = useCategories();
  const { toast } = useToast();

  useEffect(() => {
    if (option) {
      setFormData({
        category_id: option.category_id,
        option_type: option.option_type,
        name_ar: option.name_ar,
        name_en: option.name_en,
        price: option.price || 0,
        is_required: option.is_required,
        is_active: option.is_active,
        sort_order: option.sort_order,
        pricing_model: 'fixed'
      });
    } else {
      setFormData({
        category_id: selectedCategoryId,
        option_type: '',
        name_ar: '',
        name_en: '',
        price: 0,
        is_required: false,
        is_active: true,
        sort_order: 0,
        pricing_model: 'fixed'
      });
    }
  }, [option, selectedCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (option) {
        await updateCustomizationOption(option.id, formData);
        toast({
          title: "تم تحديث الخيار",
          description: "تم تحديث خيار التخصيص بنجاح",
        });
      } else {
        await addCustomizationOption(formData);
        toast({
          title: "تم إضافة الخيار",
          description: "تم إضافة خيار التخصيص الجديد بنجاح",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الخيار",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {option ? 'تعديل خيار التخصيص' : 'إضافة خيار تخصيص جديد'}
            </h3>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name_ar} ({category.name_en})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Option Type */}
            <div className="space-y-2">
              <Label>نوع الخيار</Label>
              <Select
                value={formData.option_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, option_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخيار" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPTION_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label_ar} ({type.label_en})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم بالعربية</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder="اسم الخيار بالعربية"
                  className="text-right"
                  dir="rtl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>الاسم بالإنجليزية</Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder="Option name in English"
                  required
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>السعر الإضافي (جنيه)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label>ترتيب العرض</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">خيار مطلوب</Label>
                  <p className="text-sm text-muted-foreground">
                    هل يجب على العميل اختيار هذا الخيار؟
                  </p>
                </div>
                <Switch
                  checked={formData.is_required}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_required: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">مفعل</Label>
                  <p className="text-sm text-muted-foreground">
                    هل سيظهر هذا الخيار للعملاء؟
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                إلغاء
              </Button>
              <Button type="submit" className="flex-1">
                {option ? 'تحديث الخيار' : 'إضافة الخيار'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EnhancedCustomizationManager = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<CustomizationOption | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const { categories } = useCategories();
  const { customizationOptions, updateCustomizationOption, deleteCustomizationOption, addCustomizationOption } = useCustomizationOptions();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter options by selected category and search term
  const filteredOptions = customizationOptions.filter(option => {
    const matchesCategory = selectedCategoryId === 'all' || option.category_id === selectedCategoryId;
    const matchesSearch = !searchTerm || 
      option.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.name_en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || option.option_type === filterType;
    
    return matchesCategory && matchesSearch && matchesType;
  }).sort((a, b) => a.sort_order - b.sort_order);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = filteredOptions.findIndex(item => item.id === active.id);
      const newIndex = filteredOptions.findIndex(item => item.id === over?.id);

      const newOrder = arrayMove(filteredOptions, oldIndex, newIndex);
      
      // Update sort orders
      try {
        await Promise.all(
          newOrder.map((option, index) =>
            updateCustomizationOption(option.id, { sort_order: index })
          )
        );
        
        toast({
          title: "تم تحديث الترتيب",
          description: "تم إعادة ترتيب الخيارات بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إعادة الترتيب",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddOption = () => {
    setEditingOption(null);
    setIsDialogOpen(true);
  };

  const handleEditOption = (option: CustomizationOption) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  const handleDeleteOption = async (optionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الخيار؟')) {
      try {
        await deleteCustomizationOption(optionId);
        toast({
          title: "تم حذف الخيار",
          description: "تم حذف خيار التخصيص بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف الخيار",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleActive = async (optionId: string, isActive: boolean) => {
    try {
      await updateCustomizationOption(optionId, { is_active: isActive });
      toast({
        title: isActive ? "تم تفعيل الخيار" : "تم إلغاء تفعيل الخيار",
        description: `تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} الخيار بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الخيار",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateOption = async (option: CustomizationOption) => {
    try {
      const duplicateData = {
        category_id: option.category_id,
        option_type: option.option_type,
        name_ar: `${option.name_ar} (نسخة)`,
        name_en: `${option.name_en} (Copy)`,
        price: option.price || 0,
        is_required: option.is_required,
        is_active: false, // Start as inactive
        sort_order: filteredOptions.length
      };
      
      await addCustomizationOption(duplicateData);
      toast({
        title: "تم نسخ الخيار",
        description: "تم إنشاء نسخة من الخيار بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء نسخ الخيار",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة خيارات التخصيص المتقدمة</h2>
          <p className="text-muted-foreground">
            تحكم كامل في خيارات التخصيص لكل تصنيف مع إمكانية السحب والإفلات
          </p>
        </div>
        
        <Button onClick={handleAddOption} className="shrink-0">
          <Plus className="h-4 w-4 ml-2" />
          إضافة خيار جديد
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>فلترة حسب التصنيف</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="جميع التصنيفات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name_ar} ({category.name_en})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>فلترة حسب النوع</Label>
              <Select
                value={filterType}
                onValueChange={setFilterType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {Object.entries(OPTION_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.icon} {type.label_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label>البحث</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في الخيارات..."
                className="text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>قائمة خيارات التخصيص</CardTitle>
              <CardDescription>
                {filteredOptions.length} خيار من أصل {customizationOptions.length}
              </CardDescription>
            </div>
            
            {filteredOptions.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Move3D className="h-4 w-4" />
                اسحب وأفلت لإعادة الترتيب
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredOptions.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد خيارات</h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategoryId !== 'all' ? 'لا توجد خيارات في هذا التصنيف' : 'ابدأ بإضافة خيارات التخصيص الأولى'}
              </p>
              <Button onClick={handleAddOption}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة خيار جديد
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredOptions.map(option => option.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {filteredOptions.map((option) => (
                    <SortableOptionItem
                      key={option.id}
                      option={option}
                      onEdit={handleEditOption}
                      onDelete={handleDeleteOption}
                      onToggleActive={handleToggleActive}
                      onDuplicate={handleDuplicateOption}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <OptionFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        option={editingOption}
        selectedCategoryId={selectedCategoryId}
      />
    </div>
  );
};

export default EnhancedCustomizationManager;