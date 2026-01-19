/**
 * SectionRenderer 楼层工厂组件
 *
 * 根据楼层类型渲染对应组件
 */

import type { ISectionConfig, ICardListData, ICardItem } from '@/types/section';
import { CardListSection } from '@/components/sections/CardListSection';

interface SectionRendererProps {
  section: ISectionConfig<ICardListData>;
  onCardAction?: (item: ICardItem) => void;
}

export function SectionRenderer({ section, onCardAction }: SectionRendererProps) {
  if (!section.visible) {
    return null;
  }

  switch (section.type) {
    case 'card-list':
      return <CardListSection data={section.data} onCardAction={onCardAction} />;
    default:
      console.warn(`[SectionRenderer] Unknown section type: ${section.type}`);

      return null;
  }
}
