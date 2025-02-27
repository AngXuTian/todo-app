"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash, Plus, ListTodo, Calendar, DollarSign, Sliders, Book, Bike, Users, Hammer, Heart, Utensils, Sunset, Music, Briefcase, Edit, Check, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Todo {
  id: string
  activity: string
  price: number
  type: string
  bookingRequired: boolean
  accessibility: number
  completed: boolean
}

const activityTypes = [
  { value: "education", label: "Education", Icon: Book },
  { value: "recreational", label: "Recreational", Icon: Bike },
  { value: "social", label: "Social", Icon: Users },
  { value: "diy", label: "DIY", Icon: Hammer },
  { value: "charity", label: "Charity", Icon: Heart },
  { value: "cooking", label: "Cooking", Icon: Utensils },
  { value: "relaxation", label: "Relaxation", Icon: Sunset },
  { value: "music", label: "Music", Icon: Music },
  { value: "busywork", label: "Busywork", Icon: Briefcase },
]

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [form, setForm] = useState<Omit<Todo, "id" | "completed">>({
    activity: "",
    price: 0,
    type: "education",
    bookingRequired: false,
    accessibility: 0.5,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos")
    if (storedTodos) setTodos(JSON.parse(storedTodos))
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback(() => {
    if (!form.activity.trim()) return

    setTodos((prev) => [...prev, { id: crypto.randomUUID(), ...form, completed: false }])
    setForm({
      activity: "",
      price: 0,
      type: "education",
      bookingRequired: false,
      accessibility: 0.5,
    })
  }, [form])

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const editTodo = useCallback((id: string) => {
    setEditingId(id)
    const todoToEdit = todos.find((todo) => todo.id === id)
    if (todoToEdit) {
      setForm({
        activity: todoToEdit.activity,
        price: todoToEdit.price,
        type: todoToEdit.type,
        bookingRequired: todoToEdit.bookingRequired,
        accessibility: todoToEdit.accessibility,
      })
    }
  }, [todos])

  const updateTodo = useCallback(() => {
    if (editingId) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId ? { ...todo, ...form } : todo
        )
      )
      setEditingId(null)
      setForm({
        activity: "",
        price: 0,
        type: "education",
        bookingRequired: false,
        accessibility: 0.5,
      })
    }
  }, [editingId, form])

  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const totalTodos = useMemo(() => todos.length, [todos])

  const getAccessibilityColor = (value: number) => {
    if (value <= 0.3) return "text-green-500"
    if (value <= 0.7) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">To-Do List</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-medium">
              {totalTodos} {totalTodos === 1 ? "item" : "items"}
            </Badge>
            in your list
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-5 md:grid-cols-2"
          >
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="activity" className="flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4" />
                  Activity
                </Label>
                <Input
                  id="activity"
                  placeholder="Enter activity"
                  value={form.activity}
                  onChange={(e) => setForm({ ...form, activity: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price" className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  Price (RM)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type" className="flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4" />
                  Type
                </Label>
                <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map(({ value, label, Icon }) => (
                      <SelectItem key={value} value={value} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-2 border rounded-md">
                <Checkbox
                  id="booking"
                  checked={form.bookingRequired}
                  onCheckedChange={(checked) => setForm({ ...form, bookingRequired: checked as boolean })}
                />
                <Label htmlFor="booking" className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Booking Required
                </Label>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="accessibility" className="flex items-center gap-1.5">
                    <Sliders className="h-4 w-4" />
                    Accessibility
                  </Label>
                  <Badge variant="outline" className={getAccessibilityColor(form.accessibility)}>
                    {form.accessibility.toFixed(1)}
                  </Badge>
                </div>
                <Slider
                  id="accessibility"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[form.accessibility]}
                  onValueChange={(value) => setForm({ ...form, accessibility: value[0] })}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Easy</span>
                  <span>Moderate</span>
                  <span>Difficult</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                onClick={editingId ? updateTodo : addTodo} 
                disabled={!form.activity.trim()}
              >
                {editingId ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Todo
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to List
                  </>
                )}
              </Button>
              {editingId && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => {
                    setEditingId(null)
                    setForm({
                      activity: "",
                      price: 0,
                      type: "education",
                      bookingRequired: false,
                      accessibility: 0.5,
                    })
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Edit
                </Button>
              )}
            </div>
          </motion.div>
        </CardContent>
              <br />
        <CardFooter className="flex flex-col p-0 border-t-2 border ">
          <div className="w-full overflow-auto">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium">Your todo list is empty</p>
                <p className="text-sm">Add some tasks to get started!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="table-cell">Type</TableHead>
                    <TableHead className="table-cell">Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {todos.map((todo) => {
                      const activityType = activityTypes.find((type) => type.value === todo.type)
                      const TypeIcon = activityType ? activityType.Icon : ListTodo

                      return (
                        <motion.tr
                          key={todo.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={cn(todo.completed && "bg-muted/50")}
                        >
                          <TableCell>
                            <Checkbox
                              checked={todo.completed}
                              onCheckedChange={() => toggleComplete(todo.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className={cn(todo.completed && "line-through")}>{todo.activity}</span>
                              {/* <span className="text-sm text-muted-foreground ">{todo.type}</span>
                              <div className="flex items-center gap-2 mt-1 ">
                                <span className="text-sm">RM {todo.price.toFixed(2)}</span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    todo.bookingRequired ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800",
                                  )}
                                >
                                  {todo.bookingRequired ? "Booking Required" : "No Booking"}
                                </Badge>
                              </div> */}
                            </div>
                          </TableCell>
                          <TableCell className="table-cell">
                            <div className="flex items-center gap-1.5">
                              <TypeIcon className="h-4 w-4" />
                              <span>{todo.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="table-cell">
                            <div className="text-sm space-y-1">
                              <p className="flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5" />
                                RM {todo.price.toFixed(2)}
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    todo.bookingRequired ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800",
                                  )}
                                >
                                  {todo.bookingRequired ? "Booking Required" : "No Booking"}
                                </Badge>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Sliders className="h-3.5 w-3.5" />
                                <span className={getAccessibilityColor(todo.accessibility)}>
                                  {todo.accessibility.toFixed(1)}
                                </span>
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => editTodo(todo.id)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="destructive" size="icon" onClick={() => removeTodo(todo.id)}>
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
