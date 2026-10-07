import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      navigate(user ? "/dashboard" : "/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(user ? "/dashboard" : "/auth", { replace: true });
    }, 1200);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
};

export default Index;
