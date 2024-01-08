import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res);

        const { movieId } = req.query;

        if(typeof movieId !== 'string') {
            throw new Error('Invalid ID format');
        }

        if(!movieId) {
            throw new Error('ID parameter was not provided');
        }

        const movie = await prismadb.movie.findUnique({
            where: {
                id: movieId
            }
        });

        if(!movie) {
            throw new Error('Movie does not exist');
        }

        return res.status(200).json(movie);
        
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }

}