export const chapterPath = (id: string, sectionId?: string) =>
  sectionId ? `/${id}/${sectionId}` : `/${id}`;

export const homePath = () => "/";
