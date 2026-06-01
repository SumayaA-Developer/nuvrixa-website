import { Bot, Boxes, Gauge, LayoutDashboard, Network, UsersRound } from 'lucide-react';

const services = [
  {
    title: 'AI Automation',
    icon: Bot,
    description: 'Automate repetitive admin, follow-ups, reminders, internal tasks and reporting flows so your team can focus on higher-value work.'
  },
  {
    title: 'Client Portals',
    icon: UsersRound,
    description: 'Give clients a secure place to view project progress, submit requests, access documents and communicate without scattered messages.'
  },
  {
    title: 'Business Dashboards',
    icon: LayoutDashboard,
    description: 'Turn operational data into clean dashboards that show performance, progress, bottlenecks and important decisions in real time.'
  },
  {
    title: 'CRM Systems',
    icon: Boxes,
    description: 'Manage leads, clients, consultations, onboarding, packages, pipelines and communication in one structured business system.'
  },
  {
    title: 'Integrations',
    icon: Network,
    description: 'Connect the tools you already use, including websites, databases, forms, email workflows and internal management systems.'
  },
  {
    title: 'Digital Transformation',
    icon: Gauge,
    description: 'Redesign manual operations into scalable digital workflows that support growth, accountability and better service delivery.'
  }
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="section-head">
        <p className="eyebrow">What Nuvrixa builds</p>
        <h2>Systems that replace chaos with clarity.</h2>
        <p>
          Nuvrixa helps organisations centralise information, automate operations and build digital infrastructure that makes work easier to manage.
        </p>
      </div>

      <div className="grid services-grid">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article className="card" key={service.title}>
              <div className="icon-pill">
                <Icon size={23} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
