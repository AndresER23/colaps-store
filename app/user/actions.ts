"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  name: string;
  phone: string;
  address: string;
  city: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { error: "No autorizado" };
    }

    const { name, phone, address, city } = formData;

    if (!name) {
      return { error: "El nombre es requerido" };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        address,
        city,
      },
    });

    revalidatePath("/user");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Error al actualizar el perfil" };
  }
}
