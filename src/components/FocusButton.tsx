"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function FocusButton() {
    return (
        <Button asChild>
            <Link href="/focus">Start Focusing!</Link>
        </Button>
    )
}
