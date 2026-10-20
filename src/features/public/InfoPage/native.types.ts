export type NativePageProps = {
  onNavigate: (id: string) => void;
  onPageLayout: (y: number) => void;
  onHeroLayout: (height: number) => void;
  onSectionLayout: (id: string, y: number) => void;
};
