import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/hooks/useDatabase";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const OrderDetailsModal = ({ isOpen, onOpenChange, order }: OrderDetailsModalProps) => {
  if (!order) return null;

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">في الانتظار</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500">مؤكد</Badge>;
      case "preparing":
        return <Badge className="bg-orange-500">قيد التحضير</Badge>;
      case "ready":
        return <Badge className="bg-purple-500">جاهز</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">تم التوصيل</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">ملغي</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            تفاصيل الطلب #{order.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>بيانات العميل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">الاسم:</span>
                <span>{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">الهاتف:</span>
                <span>{order.customer_phone}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-medium">العنوان:</span>
                <span className="text-left max-w-xs">{order.customer_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">الحالة:</span>
                {getOrderStatusBadge(order.status)}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>عناصر الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.menu_item?.image_url && (
                        <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={item.menu_item.image_url} 
                            alt={item.menu_item.name_ar} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {item.menu_item?.name_ar || `المنتج ${item.menu_item_id.slice(0, 8)}`}
                        </p>
                        {item.menu_item?.description_ar && (
                          <p className="text-sm text-muted-foreground">
                            {item.menu_item.description_ar}
                          </p>
                        )}
                        {Object.keys(item.selected_options).length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">التخصيص: </span>
                            {Object.entries(item.selected_options).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <p className="font-medium">الكمية: {item.quantity}</p>
                      <p className="font-bold text-primary">
                        {item.total_price} جنيه
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-primary">{order.total_amount} جنيه</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>ملاحظات إضافية</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>تواريخ الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">تاريخ الإنشاء:</span>
                <span>{new Date(order.created_at).toLocaleString('ar-EG')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">آخر تحديث:</span>
                <span>{new Date(order.updated_at).toLocaleString('ar-EG')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;