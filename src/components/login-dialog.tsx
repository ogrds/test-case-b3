"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { PropsWithChildren } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { login } from "@/lib/features/authentication/authenticationSlice";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Digite seu e-mail.",
    })
    .email(),
  password: z.string({
    required_error: "Digite sua senha.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export function LoginDialog({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  async function handleSubmit(data: FormSchema) {
    try {
      await dispatch(
        login({
          email: data.email,
          password: data.password,
        })
      );

      router.push("/");
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Faça login para acessar sua conta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
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
                          placeholder="Digite seu e-mail"
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
                          type="password"
                          placeholder="Digite sua senha"
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
                Acessar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
