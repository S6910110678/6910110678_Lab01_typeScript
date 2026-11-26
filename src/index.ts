// ขั้นตอนที่ 1: ตั้งค่าโปรเจคต์ (Self-check)
console.log("Hello, TypeScript!");
import { getAvailableProducts, applyDiscountByCategory, calculateInventoryValue,
     summarizeInventoryByCategory, products, fetchProductById, processCustomerOrder } from './Computer_Store';

// ขั้นตอนที่ 2: Interface & Array Methods (Self-check)
console.log("Available:", getAvailableProducts(products));
console.log("Discount 10% Computers:", applyDiscountByCategory(products, "Computers", 10));
console.log("Inventory Value:", calculateInventoryValue(products));
console.log("Inventory Summary:", summarizeInventoryByCategory(products));

try {
    applyDiscountByCategory(products, "Computers", -10);
} catch (error) {
    console.log("Error (-10%):", (error as Error).message);
}

try {
    applyDiscountByCategory(products, "Computers", 150);
} catch (error) {
    console.log("Error (150%):", (error as Error).message);
}

const totalInventoryValue = calculateInventoryValue(products);
const categorySummary = summarizeInventoryByCategory(products);
const sumOfCategoryValues = Object.values(categorySummary).reduce((sum, value) => sum + value, 0);

console.log("Total Inventory Value:", totalInventoryValue);
console.log("Summary by Category:", categorySummary);
console.log("Sum of Category Values:", sumOfCategoryValues);
console.log("Total Inventory Value matches Sum of Category Values:",
     totalInventoryValue === sumOfCategoryValues);

// ขั้นตอนที่ 3: Async/Await จำลองการดึงข้อมูล (Self-check)
async function testStep3(): Promise<void> {
    // ทดสอบดึงสินค้าที่สำเร็จ (ดีเลย์ 1 วินาที)
    try {
        const item = await fetchProductById(1);
        console.log("[OK] Fetched Product:", item);
    } catch (error) {
        console.log("[ERR] Error fetch failed:", (error as Error).message);
    }

    // ทดสอบดึงสินค้าที่ไม่พบid
    try {
        await fetchProductById(999);
    } catch (error) {
        console.log("[EXPECTED ERR] Not found:", (error as Error).message);
    }

    //ทดสอบสั่งซื้อหลายรายการแล้วมีสต็อกไม่พอ (ต้องไม่หักสต็อกรายการแรก)
    const beforeStock = products.find(item => item.id === 1)?.stock ;
    try {
        await processCustomerOrder([{ productId: 1, quantity: 1 }, 
            { productId: 1, quantity: 99999 }]);
    } catch (error) {
        const afterStock = products.find(item => item.id === 1)?.stock ;
        console.log("[EXPECTED ERR] Order rolled back:", (error as Error).message);
        console.log("Stock before/after failed order:", beforeStock, "Stock after:", afterStock);  
    }

    // ทดสอบสั่งซื้อรายการที่ผ่านทั้งหมด
    try {
        const receipt = await processCustomerOrder([{ productId: 1, quantity: 1 }]);
        console.log("[OK] Order processed successfully. Receipt:", receipt);
    } catch (error) {
        console.log("[ERR] Order failed:", (error as Error).message);
    }
}

testStep3();