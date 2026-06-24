import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ExternalLink,
  Grid3X3,
  HeartHandshake,
  Mail,
  Map,
  MapPin,
  Menu,
  Phone,
  Search,
  X,
} from "lucide-react";
import { fallbackOrganizations, loadOrganizations } from "./services/organizations";
import "./styles.css";

const CONTACT_FORM_URL =
  import.meta.env.VITE_CONTACT_FORM_URL ||
  "https://script.google.com/macros/s/AKfycbxOVDMT8Rw8qEbXyZEIaWSqVMU6DnFMyrxKltTzfYhhaR_yhzck7vK1PxMWx8JZGLiz/exec";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const navItems = [
  { id: "home", label: "Home" },
  { id: "directory", label: "Directory" },
  { id: "join", label: "Join" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const regions = [
  { city: "Calgary", label: "Calgary", status: "Live" },
  { city: "Edmonton", label: "Edmonton", status: "Next" },
];

const typeLabels = {
  "animal-welfare": "Animal Welfare",
  "arts-culture": "Arts & Culture",
  "child-family-services": "Child & Family",
  "community-support": "Community Support",
  education: "Education",
  employment: "Employment",
  environment: "Environment",
  "food-security": "Food Security",
  "food-shelter": "Food & Shelter",
  health: "Health",
  "legal-services": "Legal Services",
  "mental-health": "Mental Health",
  "newcomer-services": "Newcomer Services",
  "sports-recreation": "Sports & Recreation",
};

function getInitialSection() {
  const path = window.location.pathname.replace("/", "");
  const hash = window.location.hash.replace("#", "");
  return navItems.some((item) => item.id === path)
    ? path
    : navItems.some((item) => item.id === hash)
      ? hash
      : "home";
}

function App() {
  const [activeSection, setActiveSection] = useState(getInitialSection);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => setActiveSection(getInitialSection());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(sectionId) {
    setActiveSection(sectionId);
    setMobileOpen(false);
    window.history.pushState(null, "", sectionId === "home" ? "/" : `/${sectionId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Header
        activeSection={activeSection}
        mobileOpen={mobileOpen}
        onNavigate={navigate}
        onToggleMobile={() => setMobileOpen((value) => !value)}
      />
      <main>
        <Section visible={activeSection === "home"}>
          <Home onNavigate={navigate} />
        </Section>
        <Section visible={activeSection === "directory"}>
          <Directory />
        </Section>
        <Section visible={activeSection === "join"}>
          <Join />
        </Section>
        <Section visible={activeSection === "about"}>
          <About />
        </Section>
        <Section visible={activeSection === "contact"}>
          <Contact />
        </Section>
      </main>
      <Footer onNavigate={navigate} />
    </>
  );
}

function Section({ visible, children }) {
  return <section className={visible ? "page-section active" : "page-section"}>{children}</section>;
}

function Header({ activeSection, mobileOpen, onNavigate, onToggleMobile }) {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <button className="brand-button" onClick={() => onNavigate("home")} type="button">
          <img src="/images/logo.png" alt="" />
          <span>Link in Action</span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? "nav-link active" : "nav-link"}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="icon-button mobile-menu-button" onClick={onToggleMobile} type="button">
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {mobileOpen ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? "nav-link active" : "nav-link"}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function Home({ onNavigate }) {
  return (
    <>
      <div className="hero">
        <div className="hero-copy">
          <span className="section-pill">Calgary is live</span>
          <h1>Link In Action</h1>
          <p>Your link to Calgary&apos;s community resources.</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onNavigate("directory")}>
              Explore resources <ArrowRight size={16} />
            </button>
            <button className="ghost-button" type="button" onClick={() => onNavigate("join")}>
              Join network
            </button>
          </div>
        </div>
        <div className="hero-media" aria-hidden="true">
          <img src="/images/hero.jpg" alt="" />
        </div>
      </div>
      <FeatureStrip />
      <div className="intro-panel">
        <div>
          <span className="section-pill">Community directory</span>
          <h2>Find support without searching across dozens of separate sites.</h2>
        </div>
        <p>
          Calgary&apos;s centralized platform for discovering community programs and services.
          Whether you&apos;re new to the city or seeking support, Link In Action brings clarity,
          access, and connection to community support.
        </p>
      </div>
    </>
  );
}

function FeatureStrip() {
  const labels = [
    "Food support",
    "Youth services",
    "Newcomer help",
    "Mental health",
    "Legal guidance",
    "Education",
    "Housing",
    "Animal welfare",
  ];
  const repeatCount = 12;

  return (
    <div className="feature-strip" aria-label="Resource categories">
      <div className="feature-track">
        {Array.from({ length: repeatCount }, () => labels)
          .flat()
          .map((label, index) => (
          <span key={`${label}-${index}`} className="feature-chip">
            <HeartHandshake size={14} /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Directory() {
  const [organizations, setOrganizations] = useState(fallbackOrganizations);
  const [source, setSource] = useState("static");
  const [city, setCity] = useState("Calgary");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [view, setView] = useState("grid");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadOrganizations()
      .then((data) => {
        if (!cancelled) {
          setOrganizations(data.records);
          setSource(data.source);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrganizations(fallbackOrganizations);
          setSource("static");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const typeOptions = useMemo(
    () => [...new Set(organizations.map((organization) => organization.type))].sort(),
    [organizations],
  );

  const visibleOrganizations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return organizations.filter((organization) => {
      const cityMatch = organization.city === city;
      const typeMatch = type === "all" || organization.type === type;
      const queryMatch =
        !normalizedQuery ||
        [organization.name, organization.description, organization.address, organization.type]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return cityMatch && typeMatch && queryMatch;
    });
  }, [city, organizations, query, type]);

  return (
    <div className="section-shell directory-shell">
      <SectionTitle
        eyebrow="Resource directory"
        title="Calgary community support, organized"
        body="Browse organizations by region, category, keyword, or map location."
      />

      <ContainerCard className="controls-card">
        <div className="region-tabs" role="tablist" aria-label="Regions">
          {regions.map((region) => (
            <button
              key={region.city}
              className={city === region.city ? "region-tab active" : "region-tab"}
              onClick={() => setCity(region.city)}
              type="button"
            >
              <span>{region.label}</span>
              <small>{region.status}</small>
            </button>
          ))}
        </div>

        <div className="filter-row">
          <label className="field search-field">
            <span>Search</span>
            <div className="input-with-icon">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Food, shelter, youth, legal..."
              />
            </div>
          </label>
          <label className="field">
            <span>Category</span>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="all">All categories</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {typeLabels[option] || option}
                </option>
              ))}
            </select>
          </label>
          <div className="view-toggle" aria-label="Directory view">
            <button
              className={view === "grid" ? "icon-button active" : "icon-button"}
              onClick={() => setView("grid")}
              title="Grid view"
              type="button"
            >
              <Grid3X3 size={17} />
            </button>
            <button
              className={view === "map" ? "icon-button active" : "icon-button"}
              onClick={() => setView("map")}
              title="Map view"
              type="button"
            >
              <Map size={17} />
            </button>
          </div>
        </div>

        <div className="result-meta">
          <span>{visibleOrganizations.length} organizations</span>
        </div>
      </ContainerCard>

      {city === "Edmonton" && visibleOrganizations.length === 0 ? (
        <ContainerCard className="coming-card">
          <MapPin size={22} />
          <div>
            <h3>Edmonton is next.</h3>
            <p>Region structure is ready. Add Edmonton records to Postgres when sourcing begins.</p>
          </div>
        </ContainerCard>
      ) : null}

      {view === "map" ? (
        <DirectoryMap organizations={visibleOrganizations} />
      ) : (
        <div className="directory-grid">
          {visibleOrganizations.map((organization) => (
            <OrganizationCard
              key={`${organization.id || organization.name}-${organization.address}`}
              organization={organization}
              open={openId === cardId(organization)}
              onToggle={() =>
                setOpenId((current) =>
                  current === cardId(organization) ? null : cardId(organization),
                )
              }
            />
          ))}
        </div>
      )}

      {visibleOrganizations.length === 0 && city !== "Edmonton" ? (
        <p className="empty-state">No organizations found matching current filters.</p>
      ) : null}
    </div>
  );
}

function cardId(organization) {
  return `${organization.id || organization.name}-${organization.address}`;
}

function OrganizationCard({ organization, open, onToggle }) {
  return (
    <ContainerCard className={open ? "organization-card open" : "organization-card"}>
      <div className="card-topline">
        <span>{typeLabels[organization.type] || organization.type}</span>
        <span>{organization.city}</span>
      </div>
      <h3>{organization.name}</h3>
      <p className="description">{organization.description}</p>
      <button className="details-button" type="button" onClick={onToggle}>
        <span>{open ? "Hide details" : "View details"}</span>
        <ChevronDown size={17} />
      </button>
      <div className="card-details" aria-hidden={!open}>
        <p>
          <MapPin size={15} />
          <span>{organization.address || "Address not listed"}</span>
        </p>
        <p>
          <Phone size={15} />
          <span>{organization.phone || "Phone not listed"}</span>
        </p>
        <div className="card-links">
          {organization.website ? (
            <a href={organization.website} target="_blank" rel="noreferrer">
              Website <ExternalLink size={14} />
            </a>
          ) : null}
          {organization.email ? (
            <a href={formatEmailLink(organization.email)}>
              Email <Mail size={14} />
            </a>
          ) : null}
        </div>
      </div>
    </ContainerCard>
  );
}

function formatEmailLink(value) {
  return value.startsWith("http") ? value : `mailto:${value}`;
}

function DirectoryMap({ organizations }) {
  const mapped = useMemo(
    () => organizations.filter((organization) => organization.lat && organization.lng),
    [organizations],
  );
  const mapCenter = useMemo(
    () =>
      mapped[0] && mapped[0].lat && mapped[0].lng
        ? { lat: Number(mapped[0].lat), lng: Number(mapped[0].lng) }
        : { lat: 51.0447, lng: -114.0719 },
    [mapped],
  );
  const [mapStatus, setMapStatus] = useState(GOOGLE_MAPS_API_KEY ? "loading" : "missing-key");

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;

    let cancelled = false;
    const previousAuthFailure = window.gm_authFailure;

    window.gm_authFailure = () => {
      setMapStatus("error");
      previousAuthFailure?.();
    };

    function initMap() {
      if (cancelled || !window.google || !document.getElementById("directory-map")) return;
      const map = new window.google.maps.Map(document.getElementById("directory-map"), {
        center: mapCenter,
        zoom: 11,
      });
      const infoWindow = new window.google.maps.InfoWindow();

      mapped.forEach((organization) => {
        const marker = new window.google.maps.Marker({
          position: { lat: Number(organization.lat), lng: Number(organization.lng) },
          map,
          title: organization.name,
        });

        marker.addListener("click", () => {
          infoWindow.setContent(
            `<strong>${organization.name}</strong><br>${organization.address || ""}`,
          );
          infoWindow.open(map, marker);
        });
      });
      setMapStatus("ready");
    }

    if (window.google?.maps) {
      initMap();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => setMapStatus("error");
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      window.gm_authFailure = previousAuthFailure;
    };
  }, [mapCenter, mapped]);

  return (
    <ContainerCard className="map-card">
      <div id="directory-map" className="map-canvas" />
      {mapStatus !== "ready" ? (
        <div className="map-placeholder">
          <MapPin size={22} />
          <p>
            {mapStatus === "missing-key"
              ? "Set VITE_GOOGLE_MAPS_API_KEY to enable map view."
              : mapStatus === "error"
                ? "Google Maps could not load. Check API key restrictions and billing."
                : "Loading map..."}
          </p>
        </div>
      ) : null}
      <p className="map-note">
        Showing {mapped.length} mapped organizations. Records without coordinates remain in grid view.
      </p>
    </ContainerCard>
  );
}

function Join() {
  const items = [
    {
      title: "Volunteer Opportunities",
      body: "Organizations may list volunteer opportunities here.",
    },
    {
      title: "Calls to Action",
      body: "Community members and organizations can respond to posted calls to action.",
    },
    {
      title: "Research Posters",
      body: "Posters targeting immigrants or newcomers can be listed here.",
    },
  ];

  return (
    <div className="section-shell">
      <SectionTitle
        eyebrow="Join the network"
        title="Make community support easier to find"
        body="Partners, volunteers, and researchers can help keep the directory useful and current."
      />
      <div className="three-grid">
        {items.map((item) => (
          <ContainerCard key={item.title} className="info-card">
            <Building2 size={20} />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </ContainerCard>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="section-shell narrow">
      <SectionTitle eyebrow="About" title="Built for clarity, access, and connection" />
      <ContainerCard className="text-card">
        <h3>Our Mission</h3>
        <p>
          Link In Action was developed to enhance access to community services by providing a
          centralized, user-friendly digital platform that connects individuals with local
          organizations and programs in Calgary. Our mission is to bridge service gaps, promote
          inclusion, and empower individuals through streamlined access to vital resources.
        </p>
        <h3>Our Objectives</h3>
        <ul>
          <li>Empower users through customized search tools.</li>
          <li>Centralize access to community services.</li>
          <li>Enhance visibility and reduce redundancy.</li>
        </ul>
      </ContainerCard>
    </div>
  );
}

function Contact() {
  const [status, setStatus] = useState("idle");

  async function submitContact(event) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;

    try {
      const response = await fetch(CONTACT_FORM_URL, {
        method: "POST",
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="section-shell narrow">
      <SectionTitle
        eyebrow="Contact"
        title="Reach Link in Action"
        body="Questions, corrections, and new community resources can start here."
      />
      <ContainerCard className="contact-card">
        <form onSubmit={submitContact}>
          <label className="field">
            <span>Name</span>
            <input name="name" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea name="message" rows="5" required />
          </label>
          <button className="primary-button full" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
          {status === "sent" ? <p className="form-message success">Thank you. Message sent.</p> : null}
          {status === "error" ? (
            <p className="form-message error">Something went wrong. Please try again.</p>
          ) : null}
        </form>
      </ContainerCard>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-shell">
        <div>
          <img src="/images/logo.png" alt="" />
          <h2>Link in Action</h2>
          <p>
            Calgary&apos;s centralized platform for community programs, services, and support.
          </p>
        </div>
        <div>
          <h3>Directory</h3>
          <button type="button" onClick={() => onNavigate("directory")}>
            Calgary resources
          </button>
          <button type="button" onClick={() => onNavigate("directory")}>
            Edmonton next
          </button>
        </div>
        <div>
          <h3>Company</h3>
          <button type="button" onClick={() => onNavigate("about")}>
            About
          </button>
          <button type="button" onClick={() => onNavigate("contact")}>
            Contact
          </button>
        </div>
        <div className="footer-socials">
          <h3>Connect</h3>
          <a href="https://www.linkedin.com/company/linkinaction" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://www.instagram.com/linkinaction" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="mailto:linkinaction@gmail.com">Email</a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Link in Action. All rights reserved.</div>
    </footer>
  );
}

function SectionTitle({ eyebrow, title, body }) {
  return (
    <div className="section-title">
      <span className="section-pill">{eyebrow}</span>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

function ContainerCard({ children, className = "" }) {
  return <div className={`container-card ${className}`}>{children}</div>;
}

createRoot(document.getElementById("root")).render(<App />);
