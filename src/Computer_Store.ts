// ขั้นตอนที่ 2: Interface & Array Methods
export interface Product {
    id : number;
    name : string;
    category : string;
    price : number;
    stock : number;
    isActive : boolean;
}

export interface Orderitem {
    productId : number;
    quantity : number;
}

export const products : Product[] = [
    { id: 1, name: "Laptop", category: "Computers", price: 1000, stock: 10, isActive: true },
    { id: 2, name: "Smartphone", category: "Computers", price: 500, stock: 20, isActive: true },
    { id: 3, name: "Tablet", category: "Computers", price: 300, stock: 15, isActive: false },
    { id: 4, name: "Headphones", category: "Accessories", price: 100, stock: 30, isActive: true },
    { id: 5, name: "Keyboard", category: "Accessories", price: 50, stock: 25, isActive: true },
    { id: 6, name: "Mouse", category: "Accessories", price: 30, stock: 40, isActive: false },
    { id: 7, name: "Monitor", category: "Displays", price: 200, stock: 12, isActive: true },
    { id: 8, name: "Printer", category: "Displays", price: 150, stock: 8, isActive: false },
];

export function getAvailableProducts(items: Product[]): Product[] {
    return items.filter(item => item.isActive && item.stock > 0);
}

export function applyDiscountByCategory(items: Product[], category: string, 
    discountPercent: number): Product[] {
        if (discountPercent < 0 || discountPercent > 100) {
            throw new Error("Discount percent must be between 0 and 100.");
    }
    const multiplier = (100 - discountPercent) / 100;
    return items.map(item => {
        if (item.category === category) {
            return { ...item, price: Number((item.price * multiplier).toFixed(2)) };
        }
        return { ...item };
    });
}

export function calculateInventoryValue(items: Product[]): number {
    return items.reduce((total, item) => total + (item.price * item.stock), 0);
}

export function summarizeInventoryByCategory(items: Product[]): Record<string, number> {
    return items.reduce<Record<string, number>>((summary, item) => {
        const current = summary[item.category] ?? 0;
        summary[item.category] = current + (item.price * item.stock);
        return summary;
    }, {});
}

// ขั้นตอนที่ 3: Async/Await จำลองการดึงข้อมูล
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchProductById(id: number): Promise<Product> {
    await delay(1000); // ดีเลย์ 1 วินาทีเพื่อจำลองการดึงข้อมูล
    const product = products.find(item => item.id === id);
    if (!product) {
        throw new Error(`Product with ID ${id} not found.`);
    }
    return product;
}

export interface OrderSummary {
    items: { productId: number; name: string; quantity: number; unitPrice: number; 
        subtotal: number }[];
    totalAmount: number;
}

export async function processCustomerOrder(orderItems: Orderitem[]): Promise<OrderSummary> {
    if (orderItems.length === 0) {
        throw new Error("Order must contain at least one item.");
    }

    const checkedItems: { product: Product; quantity: number; subtotal: number }[] = [];

    for (const orderItem of orderItems) {
        const product = await fetchProductById(orderItem.productId);
        if (!product.isActive) {
            throw new Error(`Product ${product.name} is currently inactive.`);
        }
        if (orderItem.quantity <= 0) {
            throw new Error(`Invalid quantity (${orderItem.quantity}) for "${product.name}".`);
        }
        if (orderItem.quantity > product.stock) {
            throw new Error(`Insufficient stock for "${product.name}" (available: ${product.stock}
                , requested: ${orderItem.quantity}).`);
        }

        checkedItems.push({
            product,
            quantity: orderItem.quantity,
            subtotal: Number((product.price * orderItem.quantity).toFixed(2)),
        });
    }

    for (const entry of checkedItems) {
        entry.product.stock -= entry.quantity;
    }

    const totalAmount = checkedItems.reduce((sum, entry) => sum + entry.subtotal, 0);

    return {
        items: checkedItems.map(entry => ({
            productId: entry.product.id,
            name: entry.product.name,
            quantity: entry.quantity,
            unitPrice: entry.product.price,
            subtotal: entry.subtotal
        })),
        totalAmount,
    };
}
