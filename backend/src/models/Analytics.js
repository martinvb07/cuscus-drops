import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  event: {
    type:  String,
    required: true,
    index:    true,
    enum: ['page_view', 'checkout_click', 'checkout_started', 'order_paid', 'order_created'],
  },
  data:      { type: mongoose.Schema.Types.Mixed, default: {} },
  sessionId: { type: String, index: true },
  ip:        String,
  userAgent: String,
}, { timestamps: true });

analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ event: 1, createdAt: -1 });

export default mongoose.model('Analytics', analyticsSchema);
