import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMatch extends Document {
  user: Types.ObjectId;
  matchedUser: Types.ObjectId;
  createdAt: Date;
}

const MatchSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    matchedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }
);

export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);