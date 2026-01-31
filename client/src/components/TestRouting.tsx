import { useLocation } from "wouter";

export default function TestRouting() {
  const [location] = useLocation();
  
  return (
    <div>
      <h1>Current Location: {location}</h1>
      <p>This is a test to see if routing is working properly.</p>
    </div>
  );
}