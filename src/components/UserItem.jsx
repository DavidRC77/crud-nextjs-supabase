import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const UserItem = ({ usuario }) => {
    
    const cargoData = usuario.cargos_usuarios?.[0]?.cargos; 
    const cargoDisplay = cargoData?.cargo || 'Sin Cargo'; 
    
    return (
        <div className="flex items-center justify-between p-4 border-b">     
            <div className="flex-1 min-w-0 space-y-1">
                <p className="font-semibold text-lg">{usuario.nombre} (ID: {usuario.id})</p>
                <p className="text-sm text-muted-foreground">Cargo: {cargoDisplay} | Edad: {usuario.edad}</p>
                <p className="text-sm text-muted-foreground">Email: {usuario.email}</p>
            </div>
            
            <div className="flex space-x-2">
                <Button asChild variant="default" size="sm">
                    <Link href={`/usuarios/asignar_cargo/${usuario.id}`}>
                        <Briefcase className="h-4 w-4 mr-1" />
                        Asignar Cargo
                    </Link>
                </Button>

                <Button asChild variant="secondary" size="sm">
                    <Link href={`/usuarios/edit/${usuario.id}`}>Editar</Link>
                </Button>
                <Button asChild variant="destructive" size="sm">
                    <Link href={`/usuarios/${usuario.id}`}>Eliminar</Link>
                </Button>
            </div>
        </div>
    );
}

export default UserItem;