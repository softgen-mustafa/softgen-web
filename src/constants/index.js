import {
  highlightFirstVideo,
  highlightFourthVideo,
  highlightSecondVideo,
  highlightThirdVideo,
} from "../utils";

import HomeIcon from "@mui/icons-material/Home"; // Example icons
// import CampaignIcon from "@mui/icons-material/Campaign";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";

import CodeIcon from '@mui/icons-material/Code';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SearchIcon from '@mui/icons-material/Search';
import CampaignIcon from '@mui/icons-material/Campaign';


// export const navLists = ["Home", "Services", "About", "Contact"];

export const navLists = [
  { label: "Home", icon: <HomeIcon /> },
  { label: "Services", icon: <CampaignIcon /> },
  { label: "About", icon: <InfoIcon /> },
  { label: "Contact", icon: <ContactMailIcon /> },
];


export const servicesDropdown = [
  {
    title: "Web Development",
    description: "Building responsive and high-quality websites.",
    icon: <CodeIcon />,  // Add icon here
    link: "/services/web-development",  // Add link here

  },
  {
    title: "Mobile Development",
    description: "Creating user-friendly mobile applications.",
    icon: <PhoneAndroidIcon />,  // Add icon here
    link: "/services/web-development",
  },
  {
    title: "SEO",
    description: "Improving website visibility and organic traffic.",
    icon: <SearchIcon />,  // Add icon here
    link: "/services/web-development",
  },
  {
    title: "Marketing",
    description: "Developing strategies to promote your business.",
    icon: <CampaignIcon />,  // Add icon here
    link: "/services/web-development",
  },
];

export const hightlightsSlides = [
  {
    id: 1,
    textLists: [
      "Full-Service ",
      "Development ",
      " ",
    ],
    video: highlightFirstVideo,
    videoDuration: 4,
  },
  {
    id: 2,
    textLists: ["Forge Ahead.", "Innovative. Efficient. Exceptional."],
    video: highlightSecondVideo,
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "Our platform delivers the",
      "most advanced features in development.",
      "Reach new heights",
    ],
    video: highlightThirdVideo,
    videoDuration: 5,
  },
  {
    id: 4,
    textLists: ["Discover the New Action Button.", " which will it enable in our app and web"],
    video: highlightFourthVideo,
    videoDuration: 5,
  },
];


export const footerLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];




