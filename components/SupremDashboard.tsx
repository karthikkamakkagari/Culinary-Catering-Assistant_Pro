import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { AuthUser, Ingredient, Dish, CookingItem, Customer, UserRole, Language } from '../types';
import { getTranslatedText } from '../localization';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface SupremDashboardProps {
    users: AuthUser[];
    ingredients: (Ingredient & { name: string })[]; // Expects pre-translated name
    dishes: Dish[];
    cookingItems: CookingItem[];
    customers: Customer[];
    currentUserPreferredLanguage: Language;
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">{title}</h3>
        <div className="h-64">{children}</div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string | number, color: string }> = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-slate-500 font-medium">{title}</p>
    </div>
);


const SupremDashboard: React.FC<SupremDashboardProps> = ({
    users,
    ingredients,
    dishes,
    cookingItems,
    customers,
    currentUserPreferredLanguage
}) => {
    // --- Data Processing for Charts ---

    // 1. User Roles Pie Chart
    const userRoleData = {
        labels: ['Suprem', 'Admin', 'Approved Users', 'Pending Users'],
        datasets: [{
            label: 'User Roles',
            data: [
                users.filter(u => u.role === UserRole.SUPREM).length,
                users.filter(u => u.role === UserRole.ADMIN).length,
                users.filter(u => u.role === UserRole.USER && u.is_approved).length,
                users.filter(u => !u.is_approved).length,
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        }],
    };
    
    // 2. Top 10 Priciest Items (Ingredients & Cooking Items)
    const allItems = [
        ...ingredients.map(i => ({ name: i.name, price: i.price, type: 'Ingredient' })),
        ...cookingItems.map(ci => ({ name: getTranslatedText(ci.name_localized, currentUserPreferredLanguage), price: ci.price, type: 'Cooking Item' })),
    ];
    const topPriciestItems = allItems.sort((a, b) => b.price - a.price).slice(0, 10);
    const priciestItemsData = {
        labels: topPriciestItems.map(item => item.name),
        datasets: [{
            label: 'Price (₹)',
            data: topPriciestItems.map(item => item.price),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            indexAxis: 'y' as const,
        }],
    };

    // 3. Top 5 Most Complex Dishes (by ingredient count)
    const topComplexDishes = dishes.sort((a, b) => b.ingredients.length - a.ingredients.length).slice(0, 5);
    const complexDishesData = {
        labels: topComplexDishes.map(d => getTranslatedText(d.name_localized, currentUserPreferredLanguage)),
        datasets: [{
            label: 'Number of Ingredients',
            data: topComplexDishes.map(d => d.ingredients.length),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    // 4. Top 5 Customers by Order Value
    const topCustomers = customers
        .filter(c => c.generated_order_details && c.generated_order_details.totalOrderCost > 0)
        .sort((a, b) => b.generated_order_details!.totalOrderCost - a.generated_order_details!.totalOrderCost)
        .slice(0, 5);
    const customerOrderData = {
        labels: topCustomers.map(c => c.name),
        datasets: [{
            label: 'Total Order Value (₹)',
            data: topCustomers.map(c => c.generated_order_details!.totalOrderCost),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
    };

    const barChartOptions = {
        ...chartOptions,
        indexAxis: 'y' as const, // For horizontal bar chart
        scales: {
            x: {
                beginAtZero: true
            }
        }
    };
    
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-slate-800">Suprem Dashboard</h1>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={users.length} color="text-blue-500" />
                <StatCard title="Total Ingredients" value={ingredients.length} color="text-green-500" />
                <StatCard title="Total Dishes" value={dishes.length} color="text-purple-500" />
                <StatCard title="Total Customers" value={customers.length} color="text-amber-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="User Roles Distribution">
                    <Pie data={userRoleData} options={chartOptions} />
                </ChartCard>
                <ChartCard title="Top 10 Priciest Items (Ingredients & Cooking Items)">
                    <Bar data={priciestItemsData} options={barChartOptions} />
                </ChartCard>
                <ChartCard title="Top 5 Most Complex Dishes (by # of ingredients)">
                     <Bar data={complexDishesData} options={{ ...chartOptions, indexAxis: 'x' as const, scales: {y: {beginAtZero: true}} }} />
                </ChartCard>
                <ChartCard title="Top 5 Customers by Order Value">
                     <Bar data={customerOrderData} options={{ ...chartOptions, indexAxis: 'x' as const, scales: {y: {beginAtZero: true}} }} />
                </ChartCard>
            </div>
        </div>
    );
};

export default SupremDashboard;