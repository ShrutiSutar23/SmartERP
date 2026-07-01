from flask import request, jsonify
from extensions import db
from models import Customer, Supplier, Item, Sale, Purchase, User, Company, Voucher
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


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

    @app.route("/api/suppliers")
    @jwt_required()
    def api_suppliers():
        company_id = request.args.get("company_id")
        all_suppliers = Supplier.query.filter_by(company_id=company_id).all()
        result = []
        for s in all_suppliers:
            result.append({
                "id": s.id,
                "name": s.name,
                "phone": s.phone,
                "balance_due": s.balance_due
            })
        return jsonify(result)

    @app.route("/api/add_supplier", methods=["POST"])
    @jwt_required()
    def api_add_supplier():
        data = request.get_json()
        name = data.get("name")
        phone = data.get("phone")
        company_id = data.get("company_id")
        new_supplier = Supplier(name=name, phone=phone, company_id=company_id)
        db.session.add(new_supplier)
        db.session.commit()
        return jsonify({"message": f"Supplier {name} added successfully!"})

    
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

    # ---------------- AUTH ROUTES ----------------

    @app.route("/api/signup", methods=["POST"])
    def signup():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "Email already registered"}), 400

        new_user = User(email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Signup successful! Please log in."})

    @app.route("/api/login", methods=["POST"])
    def login():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({"message": "Login successful", "token": access_token})
        else:
            return jsonify({"message": "Invalid email or password"}), 401
        
    @app.route("/api/companies", methods=["GET"])
    @jwt_required()
    def get_companies():
        user_id = get_jwt_identity()
        companies = Company.query.filter_by(user_id=user_id).all()
        result = []
        for c in companies:
            result.append({
                "id": c.id,
                "name": c.name,
                "address": c.address,
                "gst_number": c.gst_number,
                "financial_year": c.financial_year,
                "contact": c.contact,
                "state": c.state
            })
        return jsonify(result)

    @app.route("/api/companies", methods=["POST"])
    @jwt_required()
    def add_company():
        user_id = get_jwt_identity()

        existing_count = Company.query.filter_by(user_id=user_id).count()
        if existing_count >= 5:
            return jsonify({"message": "Maximum 5 companies allowed per account"}), 400

        data = request.get_json()
        new_company = Company(
            user_id=user_id,
            name=data.get("name"),
            address=data.get("address"),
            gst_number=data.get("gst_number"),
            financial_year=data.get("financial_year"),
            contact=data.get("contact"),
            state=data.get("state")
        )
        db.session.add(new_company)
        db.session.commit()
        return jsonify({"message": f"Company {new_company.name} created successfully!"})

    @app.route("/api/companies/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_company(id):
        user_id = get_jwt_identity()
        company = Company.query.filter_by(id=id, user_id=user_id).first()
        if company:
            db.session.delete(company)
            db.session.commit()
            return jsonify({"message": "Company deleted"})
        return jsonify({"message": "Company not found"}), 404

    # ---------------- PROTECTED JSON API ROUTES ----------------

    @app.route("/api/customers")
    @jwt_required()
    def api_customers():
        company_id = request.args.get("company_id")
        all_customers = Customer.query.filter_by(company_id=company_id).all()
        result = []
        for c in all_customers:
            result.append({
                "id": c.id,
                "name": c.name,
                "phone": c.phone,
                "balance": c.balance
            })
        return jsonify(result)

    @app.route("/api/add_customer", methods=["POST"])
    @jwt_required()
    def api_add_customer():
        data = request.get_json()
        name = data.get("name")
        phone = data.get("phone")
        company_id = data.get("company_id")
        new_customer = Customer(name=name, phone=phone, company_id=company_id)
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": f"Customer {name} added successfully!"})
    
    @app.route("/api/items")
    @jwt_required()
    def api_items():
        company_id = request.args.get("company_id")
        all_items = Item.query.filter_by(company_id=company_id).all()
        result = []
        for i in all_items:
            result.append({
                "id": i.id,
                "name": i.name,
                "price": i.price,
                "quantity": i.quantity
            })
        return jsonify(result)

    @app.route("/api/add_item", methods=["POST"])
    @jwt_required()
    def api_add_item():
        data = request.get_json()
        name = data.get("name")
        price = data.get("price")
        quantity = data.get("quantity")
        company_id = data.get("company_id")
        new_item = Item(name=name, price=float(price), quantity=int(quantity), company_id=company_id)
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": f"Item {name} added successfully!"})
    
    @app.route("/api/sales_voucher", methods=["POST"])
    @jwt_required()
    def api_sales_voucher():
        data = request.get_json()
        company_id = data.get("company_id")
        customer_id = int(data.get("customer_id"))
        item_id = int(data.get("item_id"))
        quantity = int(data.get("quantity"))

        item = Item.query.get(item_id)
        customer = Customer.query.get(customer_id)

        if item.quantity < quantity:
            return jsonify({"message": "Error: Not enough stock available!"}), 400

        total_amount = item.price * quantity

        item.quantity -= quantity
        customer.balance += total_amount

        new_sale = Sale(
            company_id=company_id,
            customer_id=customer_id,
            item_id=item_id,
            quantity=quantity,
            total_amount=total_amount
        )
        db.session.add(new_sale)
        db.session.commit()

        return jsonify({
            "message": f"Sale recorded! {quantity} x {item.name} sold to {customer.name}. Total: ₹{total_amount}"
        })

    @app.route("/api/sales_history")
    @jwt_required()
    def api_sales_history():
        company_id = request.args.get("company_id")
        all_sales = Sale.query.filter_by(company_id=company_id).all()
        result = []
        for s in all_sales:
            customer = Customer.query.get(s.customer_id)
            item = Item.query.get(s.item_id)
            result.append({
                "id": s.id,
                "customer_name": customer.name if customer else "Unknown",
                "item_name": item.name if item else "Unknown",
                "quantity": s.quantity,
                "total_amount": s.total_amount
            })
        return jsonify(result)
    
    @app.route("/api/voucher", methods=["POST"])
    @jwt_required()
    def add_voucher():
        data = request.get_json()
        company_id = data.get("company_id")
        voucher_type = data.get("voucher_type")
        description = data.get("description")
        amount = float(data.get("amount"))
        party_name = data.get("party_name")

        new_voucher = Voucher(
            company_id=company_id,
            voucher_type=voucher_type,
            description=description,
            amount=amount,
            party_name=party_name
        )
        db.session.add(new_voucher)
        db.session.commit()

        return jsonify({"message": f"{voucher_type} voucher of ₹{amount} recorded successfully!"})

    @app.route("/api/vouchers")
    @jwt_required()
    def get_vouchers():
        company_id = request.args.get("company_id")
        voucher_type = request.args.get("type")

        query = Voucher.query.filter_by(company_id=company_id)
        if voucher_type:
            query = query.filter_by(voucher_type=voucher_type)

        all_vouchers = query.all()
        result = []
        for v in all_vouchers:
            result.append({
                "id": v.id,
                "voucher_type": v.voucher_type,
                "description": v.description,
                "amount": v.amount,
                "party_name": v.party_name
            })
        return jsonify(result)
    

    @app.route("/api/dashboard")
    @jwt_required()
    def dashboard():
        company_id = request.args.get("company_id")

        total_sales = db.session.query(
            db.func.sum(Sale.total_amount)
        ).filter_by(company_id=company_id).scalar() or 0

        total_purchases = db.session.query(
            db.func.sum(Purchase.total_amount)
        ).filter_by(company_id=company_id).scalar() or 0

        total_customers = Customer.query.filter_by(company_id=company_id).count()
        total_suppliers = Supplier.query.filter_by(company_id=company_id).count()

        outstanding_balance = db.session.query(
            db.func.sum(Customer.balance)
        ).filter_by(company_id=company_id).scalar() or 0

        total_payable = db.session.query(
            db.func.sum(Supplier.balance_due)
        ).filter_by(company_id=company_id).scalar() or 0

        low_stock_items = Item.query.filter(
            Item.company_id == company_id,
            Item.quantity < 10
        ).all()

        low_stock = [{"name": i.name, "quantity": i.quantity} for i in low_stock_items]

        return jsonify({
            "total_sales": total_sales,
            "total_purchases": total_purchases,
            "total_customers": total_customers,
            "total_suppliers": total_suppliers,
            "outstanding_balance": outstanding_balance,
            "total_payable": total_payable,
            "low_stock_items": low_stock
        })
    