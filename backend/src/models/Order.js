import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  firstName:  String,
  lastName:   String,
  address1:   String,
  address2:   String,
  city:       String,
  province:   String,
  country:    String,
  zip:        String,
  phone:      String,
}, { _id: false });

const lineItemSchema = new mongoose.Schema({
  shopifyLineItemId: String,
  title:             String,
  variantTitle:      String,
  quantity:          Number,
  price:             String,
  sku:               String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  shopifyOrderId:     { type: String, unique: true, required: true },
  shopifyOrderNumber: { type: Number, index: true },

  customer: {
    firstName: String,
    lastName:  String,
    email:     { type: String, index: true },
    phone:     String,
  },

  shippingAddress: addressSchema,
  billingAddress:  addressSchema,
  lineItems:       [lineItemSchema],

  totalPrice:    String,
  subtotalPrice: String,
  totalTax:      String,
  currency:      String,

  financialStatus: {
    type:    String,
    enum:    ['pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'voided'],
    default: 'pending',
    index:   true,
  },

  fulfillmentStatus: {
    type:    String,
    enum:    ['unfulfilled', 'in_transit', 'dispatched', 'delivered', 'cancelled'],
    default: 'unfulfilled',
    index:   true,
  },

  trackingNumber:  String,
  trackingCompany: String,
  trackingUrl:     String,
  adminNotes:      String,
  shopifyCreatedAt: Date,
  dispatchedAt:    Date,
  deliveredAt:     Date,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
