interface SingleProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function SingleProjectPage({ params }: SingleProjectPageProps) {
  return <div>Hello, {params.projectId}</div>;
}
