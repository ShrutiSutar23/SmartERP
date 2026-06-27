from flask import request
from extensions import db
from models import Customer, Supplier, Item, Sale, Purchase

def register_routes(app):

    @app.route("/")
    def home():
        return '''
            <h1>SmartERP Dashboard</h1>
            <h3>Masters</h3>
            <a href="/add_customer">Add Customer</a> | <a href="/customers">View Customers</a><br>
            <a href="/add_supplier">Add Supplier</a> | <a href="/suppliers">View Suppliers</a><br>
            <a href="/add_item">Add Item</a> | <a href="/items">View Items</a><br>
            <h3>Vouchers</h3>
            <a href="/sales_voucher">Sales Voucher</a> | <a href="/sales_history">Sales History</a><br>
            <a href="/purchase_voucher">Purchase Voucher</a> | <a href="/purchase_history">Purchase History</a><br>
        '''

    @app.route("/add_customer", methods=["GET", "POST"])
    def add_customer():
        if request.method == "POST":
            name = request.form["name"]
            phone = request.form["phone"]
            new_customer = Customer(name=name, phone=phone)
            db.session.add(new_customer)
            db.session.commit()
            return f"Customer {name} added successfully!"
        return '''
            <form method="POST">
                Name: <input type="text" name="name"><br>
                Phone: <input type="text" name="phone"><br>
                <input type="submit" value="Add Customer">
            </form>
        '''

    @app.route("/customers")
    def view_customers():
        all_customers = Customer.query.all()
        output = "<h2>All Customers</h2><ul>"
        for c in all_customers:
            output += f"<li>{c.name} - {c.phone} - Balance: ₹{c.balance} "
            output += f"<a href='/delete_customer/{c.id}'>[Delete]</a> "
            output += f"<a href='/update_balance/{c.id}'>[Update Balance]</a></li>"
        output += "</ul>"
        return output

    @app.route("/delete_customer/<int:id>")
    def delete_customer(id):
        customer = Customer.query.get(id)
        if customer:
            db.session.delete(customer)
            db.session.commit()
            return f"Customer {customer.name} deleted."
        return "Customer not found."

    @app.route("/update_balance/<int:id>", methods=["GET", "POST"])
    def update_balance(id):
        customer = Customer.query.get(id)
        if request.method == "POST":
            new_balance = request.form["balance"]
            customer.balance = float(new_balance)
            db.session.commit()
            return f"Balance updated to ₹{customer.balance} for {customer.name}"
        return f'''
            <form method="POST">
                Update balance for {customer.name}: <input type="text" name="balance"><br>
                <input type="submit" value="Update">
            </form>
        '''

    @app.route("/add_supplier", methods=["GET", "POST"])
    def add_supplier():
        if request.method == "POST":
            name = request.form["name"]
            phone = request.form["phone"]
            new_supplier = Supplier(name=name, phone=phone)
            db.session.add(new_supplier)
            db.session.commit()
            return f"Supplier {name} added successfully!"
        return '''
            <form method="POST">
                Name: <input type="text" name="name"><br>
                Phone: <input type="text" name="phone"><br>
                <input type="submit" value="Add Supplier">
            </form>
        '''

    @app.route("/suppliers")
    def view_suppliers():
        all_suppliers = Supplier.query.all()
        output = "<h2>All Suppliers</h2><ul>"
        for s in all_suppliers:
            output += f"<li>{s.name} - {s.phone} - Due: ₹{s.balance_due}</li>"
        output += "</ul>"
        return output

    @app.route("/add_item", methods=["GET", "POST"])
    def add_item():
        if request.method == "POST":
            name = request.form["name"]
            price = request.form["price"]
            quantity = request.form["quantity"]
            new_item = Item(name=name, price=float(price), quantity=int(quantity))
            db.session.add(new_item)
            db.session.commit()
            return f"Item {name} added successfully!"
        return '''
            <form method="POST">
                Item Name: <input type="text" name="name"><br>
                Price: <input type="text" name="price"><br>
                Quantity: <input type="text" name="quantity"><br>
                <input type="submit" value="Add Item">
            </form>
        '''

    @app.route("/items")
    def view_items():
        all_items = Item.query.all()
        output = "<h2>All Items</h2><ul>"
        for i in all_items:
            output += f"<li>{i.name} - Price: ₹{i.price} - Qty: {i.quantity}</li>"
        output += "</ul>"
        return output

    @app.route("/sales_voucher", methods=["GET", "POST"])
    def sales_voucher():
        if request.method == "POST":
            customer_id = int(request.form["customer_id"])
            item_id = int(request.form["item_id"])
            quantity = int(request.form["quantity"])
            item = Item.query.get(item_id)
            customer = Customer.query.get(customer_id)
            if item.quantity < quantity:
                return "Error: Not enough stock available!"
            total_amount = item.price * quantity
            item.quantity -= quantity
            customer.balance += total_amount
            new_sale = Sale(customer_id=customer_id, item_id=item_id,
                             quantity=quantity, total_amount=total_amount)
            db.session.add(new_sale)
            db.session.commit()
            return f"Sale recorded! {quantity} x {item.name} sold to {customer.name}. Total: ₹{total_amount}"

        customers = Customer.query.all()
        items = Item.query.all()
        customer_options = "".join([f"<option value='{c.id}'>{c.name}</option>" for c in customers])
        item_options = "".join([f"<option value='{i.id}'>{i.name} (Stock: {i.quantity})</option>" for i in items])
        return f'''
            <form method="POST">
                Customer: <select name="customer_id">{customer_options}</select><br>
                Item: <select name="item_id">{item_options}</select><br>
                Quantity: <input type="text" name="quantity"><br>
                <input type="submit" value="Create Sale">
            </form>
        '''

    @app.route("/purchase_voucher", methods=["GET", "POST"])
    def purchase_voucher():
        if request.method == "POST":
            supplier_id = int(request.form["supplier_id"])
            item_id = int(request.form["item_id"])
            quantity = int(request.form["quantity"])
            item = Item.query.get(item_id)
            supplier = Supplier.query.get(supplier_id)
            total_amount = item.price * quantity
            item.quantity += quantity
            supplier.balance_due += total_amount
            new_purchase = Purchase(supplier_id=supplier_id, item_id=item_id,
                                     quantity=quantity, total_amount=total_amount)
            db.session.add(new_purchase)
            db.session.commit()
            return f"Purchase recorded! {quantity} x {item.name} bought from {supplier.name}. Total: ₹{total_amount}"

        suppliers = Supplier.query.all()
        items = Item.query.all()
        supplier_options = "".join([f"<option value='{s.id}'>{s.name}</option>" for s in suppliers])
        item_options = "".join([f"<option value='{i.id}'>{i.name} (Stock: {i.quantity})</option>" for i in items])
        return f'''
            <form method="POST">
                Supplier: <select name="supplier_id">{supplier_options}</select><br>
                Item: <select name="item_id">{item_options}</select><br>
                Quantity: <input type="text" name="quantity"><br>
                <input type="submit" value="Create Purchase">
            </form>
        '''

    @app.route("/sales_history")
    def sales_history():
        all_sales = Sale.query.all()
        output = "<h2>Sales History</h2><ul>"
        for s in all_sales:
            customer = Customer.query.get(s.customer_id)
            item = Item.query.get(s.item_id)
            output += f"<li>Sale #{s.id}: {customer.name} bought {s.quantity} x {item.name} — Total: ₹{s.total_amount}</li>"
        output += "</ul>"
        return output

    @app.route("/purchase_history")
    def purchase_history():
        all_purchases = Purchase.query.all()
        output = "<h2>Purchase History</h2><ul>"
        for p in all_purchases:
            supplier = Supplier.query.get(p.supplier_id)
            item = Item.query.get(p.item_id)
            output += f"<li>Purchase #{p.id}: Bought {p.quantity} x {item.name} from {supplier.name} — Total: ₹{p.total_amount}</li>"
        output += "</ul>"
        return output