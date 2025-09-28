'use client';

import { useRouter } from 'next/navigation';
import supabase from '@/app/utils/supabase';
import UserForm from '@/components/UserForm';

export default function CreateUserPage() {
    const router = useRouter();

    const createUser = async(userData) => {
        const {nombre, email, username, password, edad} = userData;
        
        const {error} = await supabase
                                    .from("usuarios")
                                    .insert([{nombre, email, username, password, edad}]);
        
        if(error){
            alert(`Error al crear usuario: ${error.message}`);
            return null;
        }
        return true;
    }
    
    const handleSubmit = async (userData) => {  
        const success = await createUser(userData);
        if (success) {
            router.push('/usuarios');
        }
    };
    
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Crear Nuevo Usuario</h1>
            <UserForm onSubmit={handleSubmit} isEditing={false} />
        </div>  
    );
}