<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let password = '';
	let password_confirm = '';
	let passwordError = '';

	function validatePassword() {
		if (password !== password_confirm) {
			passwordError = "Passwords don't match";
			return false;
		}
		passwordError = '';
		return true;
	}

	function handleSubmit(event: SubmitEvent) {
		if (!validatePassword()) {
			event.preventDefault();
		}
	}
</script>

<div class="mt-[150px] mx-auto w-[75%]">
	{#if $page.data.session}
		<div class="text-center border break-border rounded-sm p-4 bg-base-100">
			<div class="flex flex-col items-center justify-center mb-4 merriweather-welcome">
				<small class="nunito-sans-text mb-2">You are currently signed in as</small>
				{#if $page.data.user}
					<span class="merriweather-welcome mb-2"
						>{$page.data.user.first_name}
						{$page.data.user.last_name} ({$page.data.user.username})</span
					>
					<img
						src={`http://localhost:8000${$page.data.user.image ? $page.data.user.image : '/media/default/user.jpg'}`}
						class="w-[100px] h-[100px] rounded-full"
						alt="Your profile picture"
					/>
				{:else}
					User
				{/if}
			</div>
			<form action="?/signout" method="POST" use:enhance>
				<button type="submit" class="btn-ghost nunito-sans-text p-2 rounded-sm">Sign out</button>
			</form>
		</div>
	{:else}
		<div
			class="flex flex-col md:flex-row gap-[100px] items-center justify-center max-w-md md:max-w-none md:w-[90%] mx-auto"
		>
			<form
				method="POST"
				action="?/signin"
				use:enhance
				class="w-full flex flex-col items-center justify-center bg-base-100 rounded-sm p-4 shadow-sm"
			>
				<div class="mb-4 w-full">
					<label for="username" class="block mb-2">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						required
						class="w-full p-2 border rounded"
					/>
				</div>
				<div class="mb-4 w-full">
					<label for="password" class="block mb-2">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						class="w-full p-2 border rounded"
					/>
				</div>
				<button type="submit" class="btn-ghost nunito-sans-text p-2 rounded-sm">Sign in</button>
			</form>
			<div class="text-center text-3xl merriweather-welcome break-border-x p-2">OR</div>
			<form
				method="POST"
				action="?/signup"
				use:enhance
				class="w-full flex flex-col items-center justify-center bg-base-100 rounded-sm p-4 shadow-sm"
				on:submit={handleSubmit}
			>
				<div class="mb-4 w-full">
					<label for="first_name" class="block mb-2">First Name</label>
					<input
						type="text"
						id="first_name"
						name="first_name"
						required
						class="w-full p-2 border rounded"
					/>
				</div>
				<div class="mb-4 w-full">
					<label for="last_name" class="block mb-2">Last Name</label>
					<input
						type="text"
						id="last_name"
						name="last_name"
						required
						class="w-full p-2 border rounded"
					/>
				</div>
				<div class="mb-4 w-full">
					<label for="username_new" class="block mb-2">Username</label>
					<input
						type="text"
						id="username_new"
						name="username_new"
						required
						class="w-full p-2 border rounded"
					/>
				</div>
				<div class="mb-4 w-full">
					<label for="email" class="block mb-2">Email Address</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						class="w-full p-2 border rounded"
					/>
				</div>
				<div class="mb-4 w-full">
					<label for="password_register" class="block mb-2">Password</label>
					<input
						type="password"
						id="password_register"
						name="password_register"
						bind:value={password}
						required
						class="w-full p-2 border rounded {passwordError ? 'border-red-500' : ''}"
					/>
				</div>
				<div class="mb-4 w-full">
					<label for="password_confirm" class="block mb-2">Confirm Password</label>
					<input
						type="password"
						id="password_confirm"
						bind:value={password_confirm}
						required
						class="w-full p-2 border rounded {passwordError ? 'border-red-500' : ''}"
					/>
					{#if passwordError}
						<p class="text-red-500 text-sm mt-1">{passwordError}</p>
					{/if}
				</div>
				<button type="submit" class="btn-ghost nunito-sans-text p-2 rounded-sm">Sign up</button>
			</form>
		</div>
	{/if}
</div>
