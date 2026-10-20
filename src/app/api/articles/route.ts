import { dbService } from '@/lib/dbService';
import { fail, getSessionUser, handleError, ok, parseBody, requireStaff } from '@/lib/api';
import { articleSchema, articleUpdateSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// Public sees published articles only; staff see drafts and scheduled posts too.
export async function GET() {
  try {
    await dbService.init();
    const user = await getSessionUser();
    const articles = await dbService.getArticles({ publishedOnly: user?.role !== 'staff' });
    return ok(articles);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireStaff();
    await dbService.init();
    const body = await parseBody(req, articleSchema);
    const newArticle = await dbService.addArticle(body);
    return ok(newArticle, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: Request) {
  try {
    await requireStaff();
    await dbService.init();
    const { id, ...updates } = await parseBody(req, articleUpdateSchema);
    const updated = await dbService.updateArticle(id, updates);
    if (!updated) return fail('Article not found', 404);
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireStaff();
    await dbService.init();
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return fail('Missing article id', 400);
    const deleted = await dbService.deleteArticle(id);
    if (!deleted) return fail('Article not found', 404);
    return ok({ deleted });
  } catch (error) {
    return handleError(error);
  }
}
