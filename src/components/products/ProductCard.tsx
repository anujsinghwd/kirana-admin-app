type ProductCardProps = {
    name: string;
    price: number;
};

export default function ProductCard({ name, price }: ProductCardProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600">₹{price}</p>
        </div>
    );
}