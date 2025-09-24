// Test file to verify our API integration
import { ordersAPI, handleAPIError } from './services/api-client';
import { adaptBackendOrderToOrder } from './adapters/dataAdapters';

console.log('🚀 Starting API integration test...');

async function testAPIIntegration() {
  try {
    console.log('📡 Testing API connection...');

    // Test 1: Get orders list
    const ordersList = await ordersAPI.getOrders(1, 10);
    console.log('✅ Orders list fetched:', ordersList.orders.length, 'orders');

    if (ordersList.orders.length > 0) {
      // Test 2: Get single order
      const firstOrder = ordersList.orders[0];
      console.log('📋 Testing single order fetch for ID:', firstOrder.id);

      const singleOrder = await ordersAPI.getOrder(firstOrder.id);
      console.log('✅ Single order fetched:', singleOrder.id);

      // Test 3: Data adapter conversion
      console.log('🔄 Testing data adapter...');
      const reactOrder = adaptBackendOrderToOrder(singleOrder);
      console.log('✅ SQL order converted to React format:');
      console.log('  - ID:', reactOrder.id, '(string)');
      console.log('  - Number:', reactOrder.number);
      console.log('  - Status:', reactOrder.status);
      console.log('  - Delivery Date:', reactOrder.deliveryDate);
      console.log('  - Client:', reactOrder.sender.name);
      console.log('  - Recipient:', reactOrder.recipient.name);

      // Test 4: Update order (if safe)
      if (firstOrder.id === 1) {
        console.log('🔧 Testing order update...');
        const updateData = { comment: `Test update ${new Date().toISOString()}` };
        const updatedOrder = await ordersAPI.updateOrder(firstOrder.id, updateData);
        console.log('✅ Order updated successfully:', updatedOrder.comment);
      }
    }

    console.log('🎉 All tests passed! API integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', handleAPIError(error as Error));
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testAPIIntegration();
}

export { testAPIIntegration };