interface LeadPageProps {
  params: {
    leadId: string;
  };
}
const LeadPage = ({ params }: LeadPageProps) => {
  const { leadId } = params;

  return (
    <div className="text-white">{leadId}</div>
  )
}

export default LeadPage