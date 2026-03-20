import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminProductsScreen from '../screens/AdminProductsScreen';
import AdminProductFormScreen from '../screens/AdminProductFormScreen';
import AdminOrdersScreen from '../screens/AdminOrdersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  HomeTab: 'home-outline',
  CartTab: 'cart-outline',
  OrdersTab: 'receipt-outline',
  ProfileTab: 'person-outline',
  DashboardTab: 'grid-outline',
  ProductsTab: 'cafe-outline',
  OrdersAdminTab: 'list-outline',
  AdminProfileTab: 'person-outline'
} as const;

function TabLabel({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text style={{ color: focused ? colors.primary : colors.textSoft, fontSize: 12, fontWeight: '600' }}>
      {name}
    </Text>
  );
}

function buildTabScreenOptions(routeName: keyof typeof tabIcons) {
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSoft,
    tabBarStyle: {
      backgroundColor: '#fff',
      borderTopColor: colors.border,
      height: 64
    },
    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
      <Ionicons name={tabIcons[routeName]} size={size} color={color} />
    )
  };
}

function CustomerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          ...buildTabScreenOptions('HomeTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Home" focused={focused} />
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          ...buildTabScreenOptions('CartTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Cart" focused={focused} />
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrderHistoryScreen}
        options={{
          ...buildTabScreenOptions('OrdersTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Orders" focused={focused} />
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          ...buildTabScreenOptions('ProfileTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Profile" focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="DashboardTab"
        component={AdminDashboardScreen}
        options={{
          ...buildTabScreenOptions('DashboardTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Dashboard" focused={focused} />
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={AdminProductsScreen}
        options={{
          ...buildTabScreenOptions('ProductsTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Products" focused={focused} />
        }}
      />
      <Tab.Screen
        name="OrdersAdminTab"
        component={AdminOrdersScreen}
        options={{
          ...buildTabScreenOptions('OrdersAdminTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Orders" focused={focused} />
        }}
      />
      <Tab.Screen
        name="AdminProfileTab"
        component={ProfileScreen}
        options={{
          ...buildTabScreenOptions('AdminProfileTab'),
          tabBarLabel: ({ focused }) => <TabLabel name="Profile" focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function CustomerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detail' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Payment Information' }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AdminProductForm" component={AdminProductFormScreen} options={{ title: 'Product Form' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  return user.role === 'admin' ? <AdminStack /> : <CustomerStack />;
}
