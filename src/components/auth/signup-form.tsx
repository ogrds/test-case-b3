"use client";

import { countries } from "countries-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/lib/hooks";
import { signIn } from "@/lib/features/authentication/authenticationSlice";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LoginDialog } from "../login-dialog";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z
    .string({
      required_error: "Nome é obrigatório",
    })
    .min(1, "Nome é obrigatório"),
  lastName: z
    .string({
      required_error: "Sobrenome é obrigatório",
    })
    .min(1, "Sobrenome é obrigatório"),
  country: z.string({
    required_error: "Por favor, selecione seu país.",
  }),
  email: z
    .string({
      required_error: "Por favor, insira seu e-mail.",
    })
    .email(),
  password: z
    .string({
      required_error: "Por favor, insira sua senha.",
    })
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type FormSchema = z.infer<typeof formSchema>;

export function SignupForm() {
  const dispatch = useAppDispatch();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  async function handleSubmit(data: FormSchema) {
    try {
      await dispatch(
        signIn({
          email: data.email,
          password: data.password,
          country: data.country,
          firstName: data.firstName,
          lastName: data.lastName,
        })
      );

      router.push("/");
    } catch (error) {
      let message = "Ocorreu um erro ao cadastrar";
      if (error instanceof Error) message = error.message;
      toast({
        variant: "destructive",
        description: message,
        duration: 2000,
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Cadastro</CardTitle>
              <CardDescription>
                Insira suas informações para criar uma conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Jhon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger aria-label="Country">
                              <SelectValue placeholder="Selecione seu país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(countries).map(
                              ([code, { name }]) => (
                                <SelectItem key={code} value={code}>
                                  {name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="jhon.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="******"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  <Loader2
                    data-loading={form.formState.isSubmitting}
                    className="hidden mr-2 h-4 w-4 animate-spin data-[loading=true]:block"
                  />
                  Criar conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <div className="mt-4 text-center text-sm">
        Já tem uma conta?{" "}
        <LoginDialog>
          <Button variant="link" className="underline p-0">
            Acessar
          </Button>
        </LoginDialog>
      </div>
    </div>
  );
}
