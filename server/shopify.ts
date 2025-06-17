import { storage } from "./storage";
import { sendShopifyWelcomeEmail } from "./emailService";
import bcrypt from "bcryptjs";

interface ShopifyCustomer {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

interface ShopifyWebhookData {
  customer: ShopifyCustomer;
  order_id?: number;
  total_price?: string;
}

// Webhook handler per nuovi clienti Shopify
export async function handleShopifyCustomerCreated(customerData: ShopifyCustomer) {
  try {
    if (!customerData.email) {
      console.log('Customer without email, skipping registration');
      return;
    }

    // Verifica se il cliente esiste già
    const existingUser = await storage.getUserByEmail(customerData.email);
    if (existingUser) {
      console.log(`Customer ${customerData.email} already exists in ScrollStop`);
      return existingUser;
    }

    // Generate temporary password and hash it
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const username = customerData.first_name || customerData.email.split('@')[0];
    
    const user = await storage.createUser({
      email: customerData.email,
      password: hashedPassword,
      username
    });

    console.log(`Created ScrollStop account for Shopify customer: ${customerData.email}`);
    
    // Send welcome email with credentials
    await sendShopifyWelcomeEmail(customerData.email, tempPassword, username);
    
    return user;
  } catch (error) {
    console.error('Error handling Shopify customer:', error);
    throw error;
  }
}

// Webhook handler per ordini Shopify
export async function handleShopifyOrderCreated(webhookData: ShopifyWebhookData) {
  try {
    const { customer, order_id, total_price } = webhookData;
    
    // Registra/aggiorna cliente
    const user = await handleShopifyCustomerCreated(customer);
    
    if (user) {
      // Attiva premium se l'ordine include ScrollStop
      if (total_price && parseFloat(total_price) >= 14.90) {
        await activatePremiumForUser(user.id);
      }
      console.log(`Processed Shopify order ${order_id} for ${customer.email}`);
    }
    
    return user;
  } catch (error) {
    console.error('Error handling Shopify order:', error);
    throw error;
  }
}

// Genera password temporanea per clienti Shopify
function generateTempPassword(): string {
  return Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-8);
}

// Attiva premium per utente
async function activatePremiumForUser(userId: number) {
  // Implementa logica per attivare premium
  // Aggiorna UserStats o crea flag premium
  console.log(`Activated premium for user ${userId}`);
}

// Email di benvenuto gestita dal servizio email esterno

// Importa clienti esistenti da Shopify
export async function importShopifyCustomers(shopifyApiKey: string, shopUrl: string) {
  try {
    const response = await fetch(`https://${shopUrl}/admin/api/2023-10/customers.json`, {
      headers: {
        'X-Shopify-Access-Token': shopifyApiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    const customers = data.customers || [];
    
    let imported = 0;
    for (const customer of customers) {
      try {
        await handleShopifyCustomerCreated(customer);
        imported++;
      } catch (error) {
        console.error(`Failed to import customer ${customer.email}:`, error);
      }
    }

    return { imported, total: customers.length };
  } catch (error) {
    console.error('Error importing Shopify customers:', error);
    throw error;
  }
}