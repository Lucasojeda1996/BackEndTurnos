import Users from "../models/User.model.js";

class UserRepository {
    static async createUser(name, email, password) {
        const user = await Users.create({
            name,
            email: email.toLowerCase().trim(),
            password,
            verified_email: false
        });
        return user;
    }

    static async getByEmail(email) {
        // ✅ Devolvemos el usuario real, no "true"
        const user = await Users.findOne({ email: email.toLowerCase().trim() });
        return user;
    }

    static async getAll() {
        const users = await Users.find();
        return users;
    }

    static async getById(user_id) {
        const user_found = await Users.findById(user_id);
        return user_found;
    }
    
    static async deleteById(user_id) {
        await Users.findByIdAndDelete(user_id);
        return true;
    }

    static async updateById(user_id, new_values) {
        const user_updated = await Users.findByIdAndUpdate(
            user_id,
            new_values,
            { new: true } // Retorna el usuario actualizado
        );
        return user_updated;
    }
}

export default UserRepository;
