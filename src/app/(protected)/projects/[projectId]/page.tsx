import { PageProps } from "../../../../../.next/types/app/page";

interface SingleProjectPageProps extends PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function SingleProjectPage({
  params,
}: SingleProjectPageProps) {
  const { projectId } = await params;
  return <div>Hello, {projectId}</div>;
}
