'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserForm =({onSubmit,editingUser = {},isEditing=false})=>{
    const [formData,setFormData]=useState({
        nombre:editingUser.nombre || '',
        email:editingUser.email || '',
        username:editingUser.username || '',
        password:editingUser.password || '',
        edad:editingUser.edad || ''
    });
    const router = useRouter();

    useEffect(()=>{
        if (isEditing && editingUser.id) {
            setFormData({
                nombre: editingUser.nombre || '',
                email: editingUser.email || '',
                username: editingUser.username || '',
                password: '', 
                edad: editingUser.edad || ''
            });
        }
    },[editingUser, isEditing]);

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
    }
    
    const handleSubmit=(e)=>{
        e.preventDefault();
        
        let dataToSubmit={...formData};
        
        if(isEditing){
            dataToSubmit.id=editingUser.id; 
            
            for (const key in dataToSubmit) {
                if (dataToSubmit[key] === '') {
                    delete dataToSubmit[key];
                }
            }
        }
        
        onSubmit(dataToSubmit);
    }

    const handleCancel=()=>{
        router.push('/users');
    }

    return(
        <div className="max-w-xl mx-auto border p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor='nombre'>Nombre:</Label>
                    <Input type="text" id="nombre" name="nombre" 
                        value={formData.nombre}
                        onChange={handleChange} required /> 
                </div>
                <div className="space-y-2">
                    <Label htmlFor='email'>Email:</Label>
                    <Input type="email" id="email" name="email" 
                        value={formData.email}
                        onChange={handleChange} required /> 
                </div>
                <div className="space-y-2">
                    <Label htmlFor='username'>Username:</Label>
                    <Input type="text" id="username" name="username" 
                        value={formData.username}
                        onChange={handleChange} required /> 
                </div>
                <div className="space-y-2">
                    <Label htmlFor='password'>Password:</Label>
                    <Input type="password" id="password" name="password" 
                        value={formData.password}
                        onChange={handleChange} 
                        placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''} 
                        required={!isEditing} /> 
                </div>
                <div className="space-y-2">
                    <Label htmlFor='edad'>Edad:</Label>
                    <Input type="number" id="edad" name="edad" 
                        value={formData.edad}
                        onChange={handleChange} required /> 
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                </div>
            </form>
        </div>

    )
}
export default UserForm;