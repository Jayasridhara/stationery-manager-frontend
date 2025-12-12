export const initialCategories = [
    { id: 'cat-1', name: 'Writing Tools' },
    { id: 'cat-2', name: 'Paper Products' },
    { id: 'cat-3', name: 'Desk Accessories' },
];

export const initialItems = [
    // Unique Item ID, Item Name, Department Issued To, Issued Date (FR6)
    { id: 'item-101', name: 'Blue Pen (Gel)', categoryId: 'cat-1', department: 'HR', issuedDate: '2025-11-01', serialNumber: 'SN001' },
    { id: 'item-102', name: 'A4 Ruled Pad', categoryId: 'cat-2', department: 'IT', issuedDate: '2025-11-20', serialNumber: 'SN002' },
    { id: 'item-103', name: 'Stapler (Heavy Duty)', categoryId: 'cat-3', department: 'Finance', issuedDate: '2025-12-05', serialNumber: 'SN003' },
];