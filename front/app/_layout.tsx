// app/_layout.tsx
import { AuthProvider } from '@/hooks/AuthContext';
import RootLayoutNav from "@/app/RootLayoutNav";

export default function RootLayout() {
  return (
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
  );
}
