import { McpDocEntry, InstructionItem, UiText } from '@/types';
import { Button } from './ui/button';
import { vscode } from '@/lib/vscode';
import { BookOpen, Terminal } from 'lucide-react';

interface McpListProps {
  docs: McpDocEntry[];
  instructions: InstructionItem[];
  uiText?: UiText;
}

export function McpList({ docs, instructions }: McpListProps) {
  return (
    <div className="mcp-list-container p-4 space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Available MCPs & Docs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="mcp-doc-card border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() =>
                vscode.postMessage({
                  type: 'openDoc',
                  docId: doc.id,
                  language: doc.defaultLanguage,
                })
              }
            >
              <h3 className="font-bold mb-2">{doc.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{doc.description}</p>
              <div className="mt-4 flex gap-2">
                {doc.languages.map((l) => (
                  <span key={l.language} className="text-xs px-2 py-1 bg-muted rounded-full">
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {docs.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No docs found in scanned directories.
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Terminal className="w-5 h-5 mr-2" />
          Instructions / Actions
        </h2>
        <div className="space-y-2">
          {instructions.map((item) => (
            <div
              key={item.id}
              className="instruction-item flex items-center justify-between p-3 border rounded-md bg-card"
            >
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  vscode.postMessage({ type: 'executeInstruction', instructionId: item.id })
                }
              >
                {item.actionLabel}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
