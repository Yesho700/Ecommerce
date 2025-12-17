import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProducts, createProduct, deleteProduct, uploadMedia, type BackendProduct } from "@/lib/api";
import { toast } from "sonner";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access the admin panel");
      navigate("/admin/login");
      return;
    }
    load();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let imageId: string | undefined = undefined;
      let videoId: string | undefined = undefined;
      if (imageFile) {
        const upload = await (await import("@/lib/api")).uploadMediaDirect(imageFile, "products");
        imageId = upload.public_id;
      }
      if (videoFile) {
        const uploadV = await (await import("@/lib/api")).uploadMediaDirect(videoFile, "products");
        videoId = uploadV.public_id;
      }
      await createProduct({
        name,
        description,
        price: Number(price),
        category,
        images: imageId ? [imageId] : [],
        videos: videoId ? [videoId] : []
      });
      toast.success("Product created");
      setName("");
      setPrice(0);
      setCategory("");
      setDescription("");
      setImageFile(null);
      setVideoFile(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: BackendProduct) => {
    setEditingId(p._id);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditCategory(p.category);
    setEditDescription(p.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice(0);
    setEditCategory("");
    setEditDescription("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setError("");
    try {
      await (await import("@/lib/api")).updateProduct(editingId, {
        name: editName,
        price: Number(editPrice),
        category: editCategory,
        description: editDescription,
      });
      toast.success("Product updated");
      cancelEdit();
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update product";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <Button variant="outline" onClick={() => navigate("/shop")}>View Shop</Button>
        </div>

        <form onSubmit={handleCreate} className="glass-card rounded-xl p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="video">Video</Label>
              <Input id="video" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Product"}</Button>
          </div>
          {error && <p className="text-destructive mt-3">{error}</p>}
        </form>

        <div className="glass-card rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Existing Products</h2>
          {loading && <p>Loading...</p>}
          {!loading && products.length === 0 && <p className="text-muted-foreground">No products found</p>}
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p._id} className="flex items-center justify-between border border-border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  {p.images?.[0] && <img src={p.images[0]} className="w-12 h-12 object-cover rounded" />}
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">${p.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate(`/product/${p._id}`)}>View</Button>
                  <Button variant="outline" onClick={() => startEdit(p)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(p._id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
          {editingId && (
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="font-semibold mb-3">Edit Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Name</Label>
                  <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editPrice">Price</Label>
                  <Input id="editPrice" type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <Input id="editCategory" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Input id="editDescription" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={saveEdit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 

export default AdminProducts;
