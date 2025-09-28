import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto p-12 flex justify-center items-center h-[70vh]">
      <Card className="w-full max-w-lg text-center shadow-2xl p-6">
        <CardHeader>
          <CardTitle className="text-5xl font-extrabold tracking-tight text-primary">
            Diseño Web II
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mt-4 text-lg text-muted-foreground">
            Proyecto de CRUD con Next.js, Shadcn/ui y Supabase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}