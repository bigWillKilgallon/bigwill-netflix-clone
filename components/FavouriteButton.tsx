import axios from "axios";
import React, { useCallback, useMemo } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavourites from "@/hooks/useFavourites";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";

interface FavouriteButtonProps {
    movieId: string;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({ movieId }) => {
    const { mutate: mutateFavourites } = useFavourites();
    const { data: currentUser, mutate } = useCurrentUser();

    const isFavourited = useMemo(() => {
        const list = currentUser?.favouriteIds || [];

        return list.includes(movieId);
    }, [currentUser?.favouriteIds, movieId]);

    const toggleFavourites = useCallback(async () => {
        let response;

        if (isFavourited) {
            response = await axios.delete("/api/favourite", {
                data: { movieId },
            });
        } else {
            response = await axios.post("/api/favourite", { movieId });
        }

        const updatedFavouriteIds = response?.data?.favouriteIds;

        mutate({
            ...currentUser,
            favouriteIds: updatedFavouriteIds,
        });

        mutateFavourites();
    }, [movieId, isFavourited, currentUser, mutate, mutateFavourites]);

    const Icon = isFavourited ? AiOutlineCheck : AiOutlinePlus;

    return (
        <div
            onClick={toggleFavourites}
            className="
                cursor-pointer
                group/item
                w-6
                h-6
                lg:w-10
                lg:h-10
                border-white
                border-2
                rounded-full
                flex
                justify-center
                items-center
                transition
                hover:border-neutral-300
            "
        >
            <Icon className="text-white hover:text-neutral-300" size={24} />
        </div>
    );
};

export default FavouriteButton;
