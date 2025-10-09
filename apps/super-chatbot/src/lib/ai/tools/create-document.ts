import { generateUUID } from '@/lib/utils';
import { tool } from 'ai';
import { z } from 'zod';
import type { Session } from 'next-auth';
import {
  artifactKindsEnum,
  documentHandlersByArtifactKind,
} from '@/lib/artifacts/server';

interface CreateDocumentProps {
  session: Session;
  writer: any; // UIMessageStreamWriter
}

export const createDocument = ({ session, writer }: CreateDocumentProps) =>
  tool({
    description:
      'Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.',
    inputSchema: z.object({
      title: z.string(),
      kind: z.enum(artifactKindsEnum),
      content: z.string().optional(),
    }),
    execute: async ({ title, kind, content }) => {
      console.log('📄 ===== CREATE DOCUMENT TOOL CALLED =====');
      console.log('📄 KIND:', kind);
      console.log('📄 TITLE (first 100 chars):', title.substring(0, 100));
      console.log('📄 CONTENT provided:', content ? 'Yes' : 'No');
      console.log('📄 CONTENT length:', content?.length || 0);

      const id = generateUUID();
      console.log('📄 GENERATED ID:', id);

      // AICODE-NOTE: AI SDK 5.0 removed support for custom data stream events
      // Metadata (kind, id, title) is now sent via tool return value only
      console.log('📄 ✅ DOCUMENT METADATA:', { kind, id, title });

      console.log('📄 🔍 LOOKING FOR DOCUMENT HANDLER FOR KIND:', kind);
      console.log(
        '📄 📋 AVAILABLE HANDLERS:',
        documentHandlersByArtifactKind.map((h) => h.kind),
      );

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === kind,
      );

      if (!documentHandler) {
        console.error('📄 ❌ NO DOCUMENT HANDLER FOUND FOR KIND:', kind);
        throw new Error(`No document handler found for kind: ${kind}`);
      }

      console.log('📄 ✅ FOUND DOCUMENT HANDLER, CALLING onCreateDocument...');

      try {
        await documentHandler.onCreateDocument({
          id,
          title,
          content: content || '',
          dataStream: writer,
          session,
        });
        console.log('📄 ✅ DOCUMENT HANDLER COMPLETED SUCCESSFULLY');
      } catch (error) {
        console.error('📄 ❌ DOCUMENT HANDLER ERROR:', error);
        console.error(
          '📄 ❌ ERROR STACK:',
          error instanceof Error ? error.stack : 'No stack',
        );
        throw error;
      }

      // AICODE-NOTE: AI SDK 5.0 - 'finish' event removed, tool completion signals finish
      console.log('📄 ✅ DOCUMENT HANDLER COMPLETE');

      const result = {
        id,
        title,
        kind,
        content: 'A document was created and is now visible to the user.',
      };

      console.log('📄 ✅ RETURNING RESULT:', result);
      console.log('📄 ===== CREATE DOCUMENT TOOL COMPLETE =====');

      return result;
    },
  });
