import Link from 'next/link';
import UserItem from './UserItem';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const UserList = ({ usuarios }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-2xl font-bold">Lista de Usuarios ({usuarios.length})</h2>
                <Button asChild>
                    <Link href="/usuarios/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Usuario
                    </Link>
                </Button>
            </div>
            <div className="border rounded-md divide-y">
                {usuarios.length === 0 ? (
                    <p className="p-4 text-center text-muted-foreground">No hay usuarios disponibles.</p>
                ) : (
                    usuarios.map((usuario) => (
                        <UserItem key={usuario.id} usuario={usuario} />
                    ))
                )}                        
            </div>
        </div>
    );
}

export default UserList;