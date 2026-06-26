"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loader2, LayoutGrid, GripVertical } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ActionBoard as ActionBoardType } from "@/types";

interface BoardCard {
  id: string;
  text: string;
}
interface BoardColumn {
  key: string;
  title: string;
  cards: BoardCard[];
}

let cardSeq = 0;
function toColumns(board: ActionBoardType): BoardColumn[] {
  return board.columns.map((c) => ({
    key: c.key,
    title: c.title,
    cards: c.cards.map((text) => ({ id: `c${cardSeq++}`, text })),
  }));
}
function toBoard(columns: BoardColumn[]): ActionBoardType {
  return {
    columns: columns.map((c) => ({
      key: c.key,
      title: c.title,
      cards: c.cards.map((card) => card.text),
    })),
  };
}

export function ActionBoard({
  ideaId,
  initial,
}: {
  ideaId: string;
  initial: ActionBoardType | null;
}) {
  const [columns, setColumns] = useState<BoardColumn[]>(
    initial ? toColumns(initial) : []
  );
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);
  const [generating, setGenerating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function generate() {
    setGenerating(true);
    const res = await fetch(`/api/ideas/${ideaId}/board`, { method: "POST" });
    setGenerating(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "生成失败" }));
      toast.error("生成看板失败", { description: error });
      return;
    }
    const { board } = await res.json();
    setColumns(toColumns(board));
    toast.success("落地看板已生成 🗂️");
  }

  async function persist(next: BoardColumn[]) {
    const res = await fetch(`/api/ideas/${ideaId}/board`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board: toBoard(next) }),
    });
    if (!res.ok) toast.error("看板保存失败");
  }

  function colIndexOf(id: string): number {
    const direct = columns.findIndex((c) => c.key === id);
    if (direct !== -1) return direct;
    return columns.findIndex((c) => c.cards.some((card) => card.id === id));
  }

  function handleDragStart(e: DragStartEvent) {
    const id = String(e.active.id);
    for (const col of columns) {
      const found = col.cards.find((c) => c.id === id);
      if (found) {
        setActiveCard(found);
        return;
      }
    }
  }

  function handleDragOver(e: DragOverEvent) {
    const activeId = String(e.active.id);
    const overId = e.over ? String(e.over.id) : null;
    if (!overId) return;

    const from = colIndexOf(activeId);
    const to = colIndexOf(overId);
    if (from === -1 || to === -1 || from === to) return;

    setColumns((prev) => {
      const next = prev.map((c) => ({ ...c, cards: [...c.cards] }));
      const fromCards = next[from].cards;
      const idx = fromCards.findIndex((c) => c.id === activeId);
      if (idx === -1) return prev;
      const [moved] = fromCards.splice(idx, 1);

      const toCards = next[to].cards;
      const overIdx = toCards.findIndex((c) => c.id === overId);
      toCards.splice(overIdx === -1 ? toCards.length : overIdx, 0, moved);
      return next;
    });
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveCard(null);
    const activeId = String(e.active.id);
    const overId = e.over ? String(e.over.id) : null;

    let next = columns;
    if (overId) {
      const col = colIndexOf(activeId);
      if (col !== -1 && colIndexOf(overId) === col) {
        const cards = columns[col].cards;
        const oldIndex = cards.findIndex((c) => c.id === activeId);
        const newIndex = cards.findIndex((c) => c.id === overId);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          next = columns.map((c, i) =>
            i === col ? { ...c, cards: arrayMove(c.cards, oldIndex, newIndex) } : c
          );
          setColumns(next);
        }
      }
    }
    void persist(next);
  }

  if (columns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <LayoutGrid className="size-8 text-primary" />
          <p className="font-medium">看清从 0 到 1 的路径</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            缪斯会把落地过程拆成一块看板，卡片可拖拽调整。
          </p>
          <Button onClick={generate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LayoutGrid className="size-4" />
            )}
            生成落地看板
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <LayoutGrid className="size-4 text-primary" />
          落地看板
          <span className="text-xs font-normal text-muted-foreground">
            （拖动卡片调整）
          </span>
        </span>
        <Button variant="ghost" size="sm" onClick={generate} disabled={generating}>
          {generating && <Loader2 className="size-4 animate-spin" />}
          重新生成
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col) => (
            <Column key={col.key} column={col} />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? <CardBody text={activeCard.text} dragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Column({ column }: { column: BoardColumn }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-xl border bg-muted/30 p-3 transition-colors",
        isOver && "bg-accent/40 ring-2 ring-primary/30"
      )}
    >
      <span className="text-sm font-semibold">{column.title}</span>
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-12 flex-col gap-2">
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableCard({ card }: { card: BoardCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-40" : undefined}
      {...attributes}
      {...listeners}
    >
      <CardBody text={card.text} />
    </div>
  );
}

function CardBody({ text, dragging }: { text: string; dragging?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border bg-card p-2.5 text-sm shadow-sm",
        dragging ? "cursor-grabbing shadow-md" : "cursor-grab"
      )}
    >
      <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <span>{text}</span>
    </div>
  );
}
