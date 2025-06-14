"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner
} from "@nextui-org/react";
import type { User } from "@/lib/types";

interface UsersTableProps {
  params: {
    appName: string;
  };
}

export default function UsersTable({ params }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/apps/${params.appName}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [params.appName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Users for {params.appName}</h1>
      <Table aria-label="Users table">
        <TableHeader>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>REFERRAL CODE</TableColumn>
          <TableColumn>REFERRED BY</TableColumn>
          <TableColumn>REFERRAL COUNT</TableColumn>
          <TableColumn>JOINED</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.referralCode}</TableCell>
              <TableCell>{user.referredBy || "-"}</TableCell>
              <TableCell>{user.referralCount}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
