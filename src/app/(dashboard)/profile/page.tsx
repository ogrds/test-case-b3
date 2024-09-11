"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  selectUser,
  updateProfile,
} from "@/lib/features/authentication/authenticationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { countries } from "countries-list";
import { useState } from "react";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const { toast } = useToast();

  const [userData, setUserData] = useState(user);

  function handleChangeItem(key: string, value: string) {
    if (!key) return;
    if (!userData) return;

    setUserData({ ...userData, [key]: value });
  }

  async function handleUpdateProfile() {
    if (!userData) return;

    try {
      await dispatch(updateProfile(userData));

      toast({
        description: "Perfil atualizado com sucesso.",
        duration: 2000,
      });
    } catch (error) {
      let message = "Ocorreu um erro ao fazer login.";
      if (error instanceof Error) message = error.message;
      toast({
        variant: "destructive",
        description: message,
        duration: 2000,
      });
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-lg font-semibold leading-none tracking-tight">
        Editar perfil
      </h1>

      <p className="text-sm text-muted-foreground mt-4">
        Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
      </p>

      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            onChange={(e) => handleChangeItem("firstName", e.target.value)}
            defaultValue={userData?.firstName}
            className="col-span-3"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            onChange={(e) => handleChangeItem("lastName", e.target.value)}
            defaultValue={userData?.lastName}
            className="col-span-3"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            readOnly
            disabled
            value={userData?.email}
            className="col-span-3"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="country">País</Label>
          <Select
            name="country"
            onValueChange={(value) => handleChangeItem("country", value)}
            defaultValue={userData?.country}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(countries).map(([code, { name }]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-max ml-auto"
          type="button"
          onClick={handleUpdateProfile}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
