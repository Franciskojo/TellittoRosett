import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  date: string;
  readTime: string;
  author: string;
  coverImage: string;
}

const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Published', 'Draft', 'Scheduled'], default: 'Published' },
  date: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
  readTime: { type: String, default: '5 min read' },
  author: { type: String, default: 'Rosetta Ntriwaah Boakye' },
  coverImage: { type: String, required: true }
});

export const ArticleModel = models.Article || model<IArticle>('Article', ArticleSchema);
